/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createParticipants = /* GraphQL */ `
  mutation CreateParticipants($input: CreateParticipantsInput!) {
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
      __typename
    }
  }
`;
export const createOrUpdateParticipants = /* GraphQL */ `
  mutation CreateOrUpdateParticipants($input: UpdateParticipantsInput!) {
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
      __typename
    }
  }
`;
export const updateParticipants = /* GraphQL */ `
  mutation UpdateParticipants($input: UpdateParticipantsInput!) {
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
      __typename
    }
  }
`;
export const deleteParticipants = /* GraphQL */ `
  mutation DeleteParticipants($input: DeleteParticipantsInput!) {
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
      __typename
    }
  }
`;
export const createSessions = /* GraphQL */ `
  mutation CreateSessions($input: CreateSessionsInput!) {
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
`;
export const updateSessions = /* GraphQL */ `
  mutation UpdateSessions($input: UpdateSessionsInput!) {
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
`;
export const deleteSessions = /* GraphQL */ `
  mutation DeleteSessions($input: DeleteSessionsInput!) {
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
`;
export const createTagSet = /* GraphQL */ `
  mutation CreateTagSet($input: CreateTagSetInput!) {
    createTagSet(input: $input) {
      tagId
      tag
      __typename
    }
  }
`;
export const updateTagSet = /* GraphQL */ `
  mutation UpdateTagSet($input: UpdateTagSetInput!) {
    updateTagSet(input: $input) {
      tagId
      tag
      __typename
    }
  }
`;
export const deleteTagSet = /* GraphQL */ `
  mutation DeleteTagSet($input: DeleteTagSetInput!) {
    deleteTagSet(input: $input) {
      tagId
      tag
      __typename
    }
  }
`;
export const createChats = /* GraphQL */ `
  mutation CreateChats($input: CreateChatsInput!) {
    createChats(input: $input) {
      senderId
      timestamp
      receiverId
      messageContent
      chatTypeStatus
      __typename
    }
  }
`;
export const updateChats = /* GraphQL */ `
  mutation UpdateChats($input: UpdateChatsInput!) {
    updateChats(input: $input) {
      senderId
      timestamp
      receiverId
      messageContent
      chatTypeStatus
      __typename
    }
  }
`;
export const deleteChats = /* GraphQL */ `
  mutation DeleteChats($input: DeleteChatsInput!) {
    deleteChats(input: $input) {
      senderId
      timestamp
      receiverId
      messageContent
      chatTypeStatus
      __typename
    }
  }
`;
export const createConnections = /* GraphQL */ `
  mutation CreateConnections($input: CreateConnectionsInput!) {
    createConnections(input: $input) {
      otherUserId
      userId
      __typename
    }
  }
`;
export const updateConnections = /* GraphQL */ `
  mutation UpdateConnections($input: UpdateConnectionsInput!) {
    updateConnections(input: $input) {
      otherUserId
      userId
      __typename
    }
  }
`;
export const deleteConnections = /* GraphQL */ `
  mutation DeleteConnections($input: DeleteConnectionsInput!) {
    deleteConnections(input: $input) {
      otherUserId
      userId
      __typename
    }
  }
`;
export const createLocations = /* GraphQL */ `
  mutation CreateLocations($input: CreateLocationsInput!) {
    createLocations(input: $input) {
      sessionId
      userId
      latitude
      longitude
      timestamp
      __typename
    }
  }
`;
export const updateLocations = /* GraphQL */ `
  mutation UpdateLocations($input: UpdateLocationsInput!) {
    updateLocations(input: $input) {
      sessionId
      userId
      latitude
      longitude
      timestamp
      __typename
    }
  }
`;
export const createOrUpdateLocations = /* GraphQL */ `
  mutation CreateOrUpdateLocations($input: UpdateLocationsInput!) {
    createOrUpdateLocations(input: $input) {
      sessionId
      userId
      latitude
      longitude
      timestamp
      __typename
    }
  }
`;
export const deleteLocations = /* GraphQL */ `
  mutation DeleteLocations($input: DeleteLocationsInput!) {
    deleteLocations(input: $input) {
      sessionId
      userId
      latitude
      longitude
      timestamp
      __typename
    }
  }
`;
export const createUserTags = /* GraphQL */ `
  mutation CreateUserTags($input: CreateUserTagsInput!) {
    createUserTags(input: $input) {
      sessionId
      userTagId
      userId
      tagId
      fullName
      __typename
    }
  }
`;
export const updateUserTags = /* GraphQL */ `
  mutation UpdateUserTags($input: UpdateUserTagsInput!) {
    updateUserTags(input: $input) {
      sessionId
      userTagId
      userId
      tagId
      fullName
      __typename
    }
  }
`;
export const deleteUserTags = /* GraphQL */ `
  mutation DeleteUserTags($input: DeleteUserTagsInput!) {
    deleteUserTags(input: $input) {
      sessionId
      userTagId
      userId
      tagId
      fullName
      __typename
    }
  }
`;
export const createUserProfiles = /* GraphQL */ `
  mutation CreateUserProfiles($input: CreateUserProfilesInput!) {
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
`;
export const updateUserProfiles = /* GraphQL */ `
  mutation UpdateUserProfiles($input: UpdateUserProfilesInput!) {
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
`;
export const deleteUserProfiles = /* GraphQL */ `
  mutation DeleteUserProfiles($input: DeleteUserProfilesInput!) {
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
`;
