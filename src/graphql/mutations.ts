/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "..\API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createSessions = /* GraphQL */ `mutation CreateSessions($input: CreateSessionsInput!) {
  createSessions(input: $input) {
    sessionId
    startTime
    creatorId
    ownerId
    endTime
    title
    status
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSessionsMutationVariables,
  APITypes.CreateSessionsMutation
>;
export const updateSessions = /* GraphQL */ `mutation UpdateSessions($input: UpdateSessionsInput!) {
  updateSessions(input: $input) {
    sessionId
    startTime
    creatorId
    ownerId
    endTime
    title
    status
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSessionsMutationVariables,
  APITypes.UpdateSessionsMutation
>;
export const deleteSessions = /* GraphQL */ `mutation DeleteSessions($input: DeleteSessionsInput!) {
  deleteSessions(input: $input) {
    sessionId
    startTime
    creatorId
    ownerId
    endTime
    title
    status
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSessionsMutationVariables,
  APITypes.DeleteSessionsMutation
>;
export const createTagSet = /* GraphQL */ `mutation CreateTagSet($input: CreateTagSetInput!) {
  createTagSet(input: $input) {
    tagId
    tag
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTagSetMutationVariables,
  APITypes.CreateTagSetMutation
>;
export const updateTagSet = /* GraphQL */ `mutation UpdateTagSet($input: UpdateTagSetInput!) {
  updateTagSet(input: $input) {
    tagId
    tag
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTagSetMutationVariables,
  APITypes.UpdateTagSetMutation
>;
export const deleteTagSet = /* GraphQL */ `mutation DeleteTagSet($input: DeleteTagSetInput!) {
  deleteTagSet(input: $input) {
    tagId
    tag
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTagSetMutationVariables,
  APITypes.DeleteTagSetMutation
>;
export const createConnections = /* GraphQL */ `mutation CreateConnections($input: CreateConnectionsInput!) {
  createConnections(input: $input) {
    otherUserId
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateConnectionsMutationVariables,
  APITypes.CreateConnectionsMutation
>;
export const updateConnections = /* GraphQL */ `mutation UpdateConnections($input: UpdateConnectionsInput!) {
  updateConnections(input: $input) {
    otherUserId
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateConnectionsMutationVariables,
  APITypes.UpdateConnectionsMutation
>;
export const deleteConnections = /* GraphQL */ `mutation DeleteConnections($input: DeleteConnectionsInput!) {
  deleteConnections(input: $input) {
    otherUserId
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteConnectionsMutationVariables,
  APITypes.DeleteConnectionsMutation
>;
export const createLocations = /* GraphQL */ `mutation CreateLocations($input: CreateLocationsInput!) {
  createLocations(input: $input) {
    sessionId
    userId
    latitude
    longitude
    timestamp
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLocationsMutationVariables,
  APITypes.CreateLocationsMutation
>;
export const updateLocations = /* GraphQL */ `mutation UpdateLocations($input: UpdateLocationsInput!) {
  updateLocations(input: $input) {
    sessionId
    userId
    latitude
    longitude
    timestamp
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLocationsMutationVariables,
  APITypes.UpdateLocationsMutation
>;
export const createOrUpdateLocations = /* GraphQL */ `mutation CreateOrUpdateLocations($input: UpdateLocationsInput!) {
  createOrUpdateLocations(input: $input) {
    sessionId
    userId
    latitude
    longitude
    timestamp
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateOrUpdateLocationsMutationVariables,
  APITypes.CreateOrUpdateLocationsMutation
>;
export const deleteLocations = /* GraphQL */ `mutation DeleteLocations($input: DeleteLocationsInput!) {
  deleteLocations(input: $input) {
    sessionId
    userId
    latitude
    longitude
    timestamp
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLocationsMutationVariables,
  APITypes.DeleteLocationsMutation
>;
export const createUserProfiles = /* GraphQL */ `mutation CreateUserProfiles($input: CreateUserProfilesInput!) {
  createUserProfiles(input: $input) {
    userId
    fullName
    email
    identityId
    phoneNumber
    createdAt
    updatedAt
    jobTitle
    company
    profilePicture
    location
    socialLinks
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserProfilesMutationVariables,
  APITypes.CreateUserProfilesMutation
>;
export const updateUserProfiles = /* GraphQL */ `mutation UpdateUserProfiles($input: UpdateUserProfilesInput!) {
  updateUserProfiles(input: $input) {
    userId
    fullName
    email
    identityId
    phoneNumber
    createdAt
    updatedAt
    jobTitle
    company
    profilePicture
    location
    socialLinks
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserProfilesMutationVariables,
  APITypes.UpdateUserProfilesMutation
>;
export const deleteUserProfiles = /* GraphQL */ `mutation DeleteUserProfiles($input: DeleteUserProfilesInput!) {
  deleteUserProfiles(input: $input) {
    userId
    fullName
    email
    identityId
    phoneNumber
    createdAt
    updatedAt
    jobTitle
    company
    profilePicture
    location
    socialLinks
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserProfilesMutationVariables,
  APITypes.DeleteUserProfilesMutation
>;
export const createUserTags = /* GraphQL */ `mutation CreateUserTags($input: CreateUserTagsInput!) {
  createUserTags(input: $input) {
    tagId
    userId
    fullName
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUserTagsMutationVariables,
  APITypes.CreateUserTagsMutation
>;
export const updateUserTags = /* GraphQL */ `mutation UpdateUserTags($input: UpdateUserTagsInput!) {
  updateUserTags(input: $input) {
    tagId
    userId
    fullName
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUserTagsMutationVariables,
  APITypes.UpdateUserTagsMutation
>;
export const deleteUserTags = /* GraphQL */ `mutation DeleteUserTags($input: DeleteUserTagsInput!) {
  deleteUserTags(input: $input) {
    tagId
    userId
    fullName
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUserTagsMutationVariables,
  APITypes.DeleteUserTagsMutation
>;
export const createParticipants = /* GraphQL */ `mutation CreateParticipants($input: CreateParticipantsInput!) {
  createParticipants(input: $input) {
    sessionId
    userId
    joinedAt
    role
    jobTitle
    fullName
    company
    visibility
    tags
    sessionStatus
    userStatus
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateParticipantsMutationVariables,
  APITypes.CreateParticipantsMutation
>;
export const createOrUpdateParticipants = /* GraphQL */ `mutation CreateOrUpdateParticipants($input: UpdateParticipantsInput!) {
  createOrUpdateParticipants(input: $input) {
    sessionId
    userId
    joinedAt
    role
    jobTitle
    fullName
    company
    visibility
    tags
    sessionStatus
    userStatus
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateOrUpdateParticipantsMutationVariables,
  APITypes.CreateOrUpdateParticipantsMutation
>;
export const updateParticipants = /* GraphQL */ `mutation UpdateParticipants($input: UpdateParticipantsInput!) {
  updateParticipants(input: $input) {
    sessionId
    userId
    joinedAt
    role
    jobTitle
    fullName
    company
    visibility
    tags
    sessionStatus
    userStatus
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateParticipantsMutationVariables,
  APITypes.UpdateParticipantsMutation
>;
export const deleteParticipants = /* GraphQL */ `mutation DeleteParticipants($input: DeleteParticipantsInput!) {
  deleteParticipants(input: $input) {
    sessionId
    userId
    joinedAt
    role
    jobTitle
    fullName
    company
    visibility
    tags
    sessionStatus
    userStatus
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteParticipantsMutationVariables,
  APITypes.DeleteParticipantsMutation
>;
export const createChats = /* GraphQL */ `mutation CreateChats($input: CreateChatsInput!) {
  createChats(input: $input) {
    chatId
    timestamp
    messageContent
    senderId
    senderName
    receiverId
    chatTypeStatus
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateChatsMutationVariables,
  APITypes.CreateChatsMutation
>;
export const updateChats = /* GraphQL */ `mutation UpdateChats($input: UpdateChatsInput!) {
  updateChats(input: $input) {
    chatId
    timestamp
    messageContent
    senderId
    senderName
    receiverId
    chatTypeStatus
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateChatsMutationVariables,
  APITypes.UpdateChatsMutation
>;
export const deleteChats = /* GraphQL */ `mutation DeleteChats($input: DeleteChatsInput!) {
  deleteChats(input: $input) {
    chatId
    timestamp
    messageContent
    senderId
    senderName
    receiverId
    chatTypeStatus
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteChatsMutationVariables,
  APITypes.DeleteChatsMutation
>;
