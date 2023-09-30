// SessionManager.tsx
import { API, graphqlOperation, Auth } from "aws-amplify";
import {
  createSessions,
  updateSessions,
  createOrUpdateParticipants,
  updateParticipants,
} from "../src/graphql/mutations";
import { listParticipants, getParticipants } from "../src/graphql/queries";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 } from "uuid";
import participantsData from "../dummies/dummy_accounts.json";

const MAX_RETRY_ATTEMPTS = 5; // Maximum number of retry attempts

const generateUniqueSessionId = () => {
  return v4();
};

export async function getParticipantVisibility(userId, sessionId, log) {
  log.debug("getParticipantVisibility on userId: " + JSON.stringify(userId) + " and sessionId: " + JSON.stringify(sessionId));
  try {
    const userIdParticipant = await API.graphql(
      graphqlOperation(getParticipants, { userId: userId, sessionId: sessionId })
    );

    if (!userIdParticipant) {
      log.debug("Visibility data not found, returning false.");
      return false;
    }

    const visibility = userIdParticipant.data.getParticipants.visibility;
    log.debug("visibility: ", JSON.stringify(visibility));
    return visibility === "VISIBLE";
  } catch (error) {
    console.error("Error getting participant visibility:", error);
    log.error("Error getting participant visibility:", JSON.stringify(error));
  }
}

async function clearAllIntervals(log) {
  log.debug("clearAllIntervals...");
  try {
    // Retrieve the list of intervalIds from AsyncStorage
    const intervalIdsJson = await AsyncStorage.getItem("intervalIds");
    const intervalIds = intervalIdsJson ? JSON.parse(intervalIdsJson) : [];
    log.debug("intervalIds: ", JSON.stringify(intervalIds));

    // Clear each interval using clearInterval
    intervalIds.forEach((intervalId) => {
      clearInterval(intervalId);
      console.log(`Interval with ID ${intervalId} cleared.`);
    });

    // Clear the list of intervalIds from AsyncStorage
    await AsyncStorage.removeItem("intervalIds");

    console.log("All intervals cleared.");
    log.debug("All intervals cleared");
  } catch (error) {
    console.error("Error clearing intervals:", error);
    log.error("Error clearing intervals:", JSON.stringify(error));
  }
}

export async function storeSessionData(sessionData, log) {
  log.debug("storeSessionData on sessionData: ", JSON.stringify(sessionData));
  await AsyncStorage.setItem("sessionData", JSON.stringify(sessionData));
}

export async function getSessionData(log) {
  const sessionData = await AsyncStorage.getItem("sessionData");
  log.debug("getSessionData on sessionData: ", JSON.stringify(sessionData));
  if (sessionData) {
    return JSON.parse(sessionData);
  }
  return {sessionId: "INACTIVE"};
}

export async function removeSessionData(log) {
  log.debug("removeSessionData");
  await AsyncStorage.removeItem("sessionData");
}

export const fetchParticipants = async (log) => {
  let fetchedParticipants = [];
  let nextToken = null;

  try {
    const user = await Auth.currentAuthenticatedUser();
    const userId = user?.username;
    const sessionData = await getSessionData(log);
    log.debug(
      "fetchParticipants on user: " +
        JSON.stringify(user) +
        " and sessionData: " +
        JSON.stringify(sessionData)
    );

    do {
      const listParticipantsFilter = {
        sessionId: { eq: sessionData.sessionId },
        visibility: { eq: "VISIBLE" },
        userId: { ne: userId },
      };
      log.debug("listParticipants on listParticipantsFilter: ", listParticipantsFilter);

      const response = await API.graphql(
        graphqlOperation(listParticipants, {
          filter: listParticipantsFilter,
          limit: 10, // Adjust the limit as needed
          nextToken: nextToken,
        })
      );

      const { items, nextToken: newNextToken } = response.data.listParticipants;
      fetchedParticipants = [...fetchedParticipants, ...items];
      nextToken = newNextToken;
    } while (nextToken);

    log.debug("Fetched participants:", JSON.stringify(fetchedParticipants));
  } catch (error) {
    console.error("Error fetching participants:", error);
    log.error("Error fetching participants:", JSON.stringify(error));
  }

  const filteredFakeParticipants = participantsData.filter(
    (participant) => participant.visibility === "VISIBLE"
  );
  log.debug("filteredFakeParticipants: ", JSON.stringify(filteredFakeParticipants));

  const filteredParticipantsList = [
    ...fetchedParticipants,
    ...filteredFakeParticipants,
  ];
  log.debug("filteredParticipantsList: ", JSON.stringify(filteredParticipantsList));

  return filteredParticipantsList;
};

export const getSessionIdForUser = async (userId, log) => {
  log.debug("getSessionIdForUser on userId: ", JSON.stringify(userId));
  try {
    const filter = {
      userId: { eq: userId },
      sessionStatus: { ne: "INACTIVE" },
      userStatus: {ne: "INACTIVE"}
    };

    log.debug("listParticipants on filter: ", JSON.stringify(filter));
    const listParticipantsResponse = await API.graphql(
      graphqlOperation(listParticipants, { filter })
    );
    const participants = listParticipantsResponse.data.listParticipants.items;
    log.debug("participants: ", JSON.stringify(participants));

    if (participants.length === 0) {
      log.debug("getSessionIdForUser sessionId: INACTIVE");
      return "INACTIVE";
    }

    log.debug('getSessionIdForUser sessionId: ', JSON.stringify(participants[0].sessionId));
    return participants[0].sessionId;
  } catch (error) {
    console.error("Error fetching session ID for user:", error);
    log.error("Error fetching session ID for user:", JSON.stringify(error));
    return "INACTIVE";
  }
};

const createSessionWithRetry = async (userId, title, log, retryAttempt = 1) => {
  log.debug(
    "createSessionWithRetry on userId: " +
      JSON.stringify(userId) +
      " and title: " +
      JSON.stringify(title) +
      " and retryAttempt: " +
      JSON.stringify(retryAttempt)
  );
  if (retryAttempt > MAX_RETRY_ATTEMPTS) {
    log.error(`Failed to create session after ${MAX_RETRY_ATTEMPTS} attempts`);
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
  log.debug("createSessions on input: ", JSON.stringify(input));

  try {
    const response = await API.graphql({
      query: createSessions,
      variables: input,
    });

    const newSession = response.data.createSessions;

    console.log("Session started:", newSession);
    log.debug("Session started:", JSON.stringify(newSession));

    return newSession; // Optionally, you can return the new session object
  } catch (error) {
    console.error("Error starting session:", error);
    log.error("Error starting session:", JSON.stringify(error));

    // Retry with a new session ID
    return createSessionWithRetry(userId, title, log, retryAttempt + 1);
  }
};

const propagateSessionIdUpdate = async (userId, sessionId, sessionStatus, userStatus, log) => {
  try {
    log.debug('propagateSessionIdUpdate on userId: ' + JSON.stringify(userId) + ' and sessionId: ' + JSON.stringify(sessionId) + ' and sessionStatus: ' + JSON.stringify(sessionStatus) + ' and userStatus: ' + JSON.stringify(userStatus));

  const updateParticipantsInput = {
    input: {
      userId,
      sessionId,
      sessionStatus,
      userStatus
    }
  };

  // Call the updateParticipants mutation to update sessionIds
  log.debug('updateParticipants on input: ', JSON.stringify(updateParticipantsInput));
  await API.graphql(graphqlOperation(updateParticipants, updateParticipantsInput));

    // Log success or any other necessary information
    log.debug('Session updates propagated successfully');
  } catch (error) {
    // Handle errors
    console.error('Error propagating session updates:', error);
    log.error('Error propagating session updates:', JSON.stringify(error));
  }
};

export const createOrUpdateParticipant = async (
  userId,
  fullName,
  sessionId,
  log
) => {
  log.debug(
    "createOrUpdateParticipant on userId: " +
      JSON.stringify(userId) +
      " and fullName: " +
      JSON.stringify(fullName) +
      " and sessionId: " +
      JSON.stringify(sessionId)
  );
  const now = new Date().toISOString();

  const input = {
    input: {
      sessionId: sessionId,
      userId: userId,
      joinedAt: now,
      fullName: fullName,
      visibility: "VISIBLE",
      sessionStatus: "ACTIVE",
      userStatus: "ACTIVE"
    },
  };

  log.debug("createOrUpdateParticipants on input: ", JSON.stringify(input));
  try {
    const response = await API.graphql({
      query: createOrUpdateParticipants,
      variables: input,
    });

    const newParticipant = response.data.createOrUpdateParticipants;

    console.log("Participant joined:", newParticipant);
    log.debug("Participant joined:", JSON.stringify(newParticipant));
  } catch (error) {
    console.error("Error joining participant:", error);
    log.error("Error joining participant:", JSON.stringify(error));
    throw error;
  }
};

export const startSession = async (userProfileData, title, log) => {
  log.debug(
    "startSession on userProfileData: " +
      JSON.stringify(userProfileData) +
      " and title: " +
      JSON.stringify(title)
  );
  try {
    const userId = userProfileData.userId;
    const fullName = userProfileData.fullName;

    const newSession = await createSessionWithRetry(userId, title, log);
    await createOrUpdateParticipant(userId, fullName, newSession.sessionId, log);

    storeSessionData(newSession, log);
    log.debug("Started new session: ", JSON.stringify(newSession));

    return newSession;
  } catch (error) {
    // Handle the error as needed
    log.error("Failed to start session: ", JSON.stringify(error));
    throw error;
  }
};

export const exitSession = async (userId, sessionId, log) => {
log.debug('exitSession on userId: ' + JSON.stringify(userId) + ' and sessionId: ' + JSON.stringify(sessionId));
  try {
    // Prepare the input for the deleteParticipants mutation
    const input = {
      input: {
        userId,
        sessionId,
        userStatus: "INACTIVE",
        visibility: "INVISIBLE",
      },
    };

    // Call the updateParticipants mutation to remove the participant from the session
    const response = await API.graphql(graphqlOperation(updateParticipants, input));

    log.debug('Participant exited from session:', JSON.stringify(response.data.updateParticipants));
  } catch (error) {
    console.error('Error exiting participant from session:', error);
    log.error('Error exiting participant from session:', JSON.stringify(error));
    throw error; // Re-throw the error to be handled by the caller if needed
  }
};

export const endSession = async (userId, sessionId, startTime, log) => {
  log.debug(
    "endSession on userId: " + JSON.stringify(userId) + " and sessionId: " + JSON.stringify(sessionId) + " and startTime: " + JSON.stringify(startTime)
  );
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

    log.debug("updateSessions on input: ", JSON.stringify(input));
    const response = await API.graphql({
      query: updateSessions,
      variables: input,
    });

    const updatedSession = response.data.updateSessions;
    removeSessionData(log);
    await clearAllIntervals(log);

    await propagateSessionIdUpdate(userId, sessionId, "INACTIVE", "INACTIVE", log);

    console.log("Session ended:", updatedSession);
    log.debug("Session ended:", JSON.stringify(updatedSession));
    return updatedSession;
  } catch (error) {
    console.error("Error ending session:", error);
    log.error("Error ending session:", JSON.stringify(error));
    throw error;
  }
};
