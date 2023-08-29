// SessionManager.tsx
import { API, graphqlOperation } from "aws-amplify";
import {
  createSessions,
  updateSessions,
  createParticipants,
} from "../src/graphql/mutations";
import { listParticipants } from "../src/graphql/queries";
import "react-native-get-random-values";
import { v4 } from "uuid";

const MAX_RETRY_ATTEMPTS = 5; // Maximum number of retry attempts

const generateUniqueSessionId = () => {
  return v4();
};

export const getSessionIdForUser = async (userId) => {
  try {
    const filter = {
      userId: { eq: userId },
      sessionStatus: { ne: "INACTIVE" },
    };

    const listParticipantsResponse = await API.graphql(
      graphqlOperation(listParticipants, { filter })
    );
    const participants = listParticipantsResponse.data.listParticipants.items;

    if (participants.length === 0) {
      return "INACTIVE";
    }

    return participants[0].sessionId;
  } catch (error) {
    console.error("Error fetching session ID for user:", error);
    return "INACTIVE";
  }
};

const createSessionWithRetry = async (userId, title, retryAttempt = 1) => {
  if (retryAttempt > MAX_RETRY_ATTEMPTS) {
    throw new Error(
      `Failed to create session after ${MAX_RETRY_ATTEMPTS} attempts`
    );
  }

  const now = new Date().toISOString();

  const input = {
    input: {
      sessionId: generateUniqueSessionId(),
      creatorId: userId,
      ownerId: userId,
      startTime: now,
      endTime: null,
      title: title,
      status: "ACTIVE",
    },
  };

  try {
    const response = await API.graphql({
      query: createSessions,
      variables: input,
    });

    const newSession = response.data.createSessions;

    console.log("Session started:", newSession);

    return newSession; // Optionally, you can return the new session object
  } catch (error) {
    console.error("Error starting session:", error);

    // Retry with a new session ID
    return createSessionWithRetry(userId, title, retryAttempt + 1);
  }
};

const createParticipant = async (userId, fullName, sessionId) => {
  const now = new Date().toISOString();

  const input = {
    input: {
      sessionId: sessionId,
      userId: userId,
      joinedAt: now,
      fullName: fullName,
      visibility: "VISIBLE",
      sessionStatus: "ACTIVE",
    },
  };

  try {
    const response = await API.graphql({
      query: createParticipants,
      variables: input,
    });

    const newParticipant = response.data.createParticipants;

    console.log("Participant created:", newParticipant);
  } catch (error) {
    console.error("Error creating participant:", error);
    throw error;
  }
};

export const startSession = async (userProfileData, title) => {
  try {
    const userId = userProfileData.userId;
    const fullName = userProfileData.fullName;

    const newSession = await createSessionWithRetry(userId, title);
    await createParticipant(userId, fullName, newSession.sessionId);

    return newSession;
  } catch (error) {
    // Handle the error as needed
    throw error;
  }
};

export const endSession = async (sessionId, startTime) => {
  try {
    const now = new Date().toISOString();

    const input = {
      input: {
        sessionId: sessionId,
        startTime: startTime,
        endTime: now,
        status: "INACTIVE", // Set the status to 'INACTIVE' when ending a session
      },
    };

    const response = await API.graphql({
      query: updateSessions,
      variables: input,
    });

    const updatedSession = response.data.updateSessions;

    console.log("Session ended:", updatedSession);
    return updatedSession;
  } catch (error) {
    console.error("Error ending session:", error);
    throw error;
  }
};
