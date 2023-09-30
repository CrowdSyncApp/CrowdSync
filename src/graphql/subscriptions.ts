/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "..\API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateSessions = /* GraphQL */ `subscription OnCreateSessions(
  $sessionId: ID
  $startTime: AWSDateTime
  $creatorId: String
  $ownerId: String
  $endTime: AWSDateTime
) {
  onCreateSessions(
    sessionId: $sessionId
    startTime: $startTime
    creatorId: $creatorId
    ownerId: $ownerId
    endTime: $endTime
  ) {
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
` as GeneratedSubscription<
  APITypes.OnCreateSessionsSubscriptionVariables,
  APITypes.OnCreateSessionsSubscription
>;
export const onUpdateSessions = /* GraphQL */ `subscription OnUpdateSessions(
  $sessionId: ID
  $startTime: AWSDateTime
  $creatorId: String
  $ownerId: String
  $endTime: AWSDateTime
) {
  onUpdateSessions(
    sessionId: $sessionId
    startTime: $startTime
    creatorId: $creatorId
    ownerId: $ownerId
    endTime: $endTime
  ) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateSessionsSubscriptionVariables,
  APITypes.OnUpdateSessionsSubscription
>;
export const onDeleteSessions = /* GraphQL */ `subscription OnDeleteSessions(
  $sessionId: ID
  $startTime: AWSDateTime
  $creatorId: String
  $ownerId: String
  $endTime: AWSDateTime
) {
  onDeleteSessions(
    sessionId: $sessionId
    startTime: $startTime
    creatorId: $creatorId
    ownerId: $ownerId
    endTime: $endTime
  ) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteSessionsSubscriptionVariables,
  APITypes.OnDeleteSessionsSubscription
>;
export const onCreateTagSet = /* GraphQL */ `subscription OnCreateTagSet($tagId: String, $tag: String) {
  onCreateTagSet(tagId: $tagId, tag: $tag) {
    tagId
    tag
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTagSetSubscriptionVariables,
  APITypes.OnCreateTagSetSubscription
>;
export const onUpdateTagSet = /* GraphQL */ `subscription OnUpdateTagSet($tagId: String, $tag: String) {
  onUpdateTagSet(tagId: $tagId, tag: $tag) {
    tagId
    tag
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTagSetSubscriptionVariables,
  APITypes.OnUpdateTagSetSubscription
>;
export const onDeleteTagSet = /* GraphQL */ `subscription OnDeleteTagSet($tagId: String, $tag: String) {
  onDeleteTagSet(tagId: $tagId, tag: $tag) {
    tagId
    tag
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTagSetSubscriptionVariables,
  APITypes.OnDeleteTagSetSubscription
>;
export const onCreateConnections = /* GraphQL */ `subscription OnCreateConnections($otherUserId: String, $userId: String) {
  onCreateConnections(otherUserId: $otherUserId, userId: $userId) {
    otherUserId
    userId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConnectionsSubscriptionVariables,
  APITypes.OnCreateConnectionsSubscription
>;
export const onUpdateConnections = /* GraphQL */ `subscription OnUpdateConnections($otherUserId: String, $userId: String) {
  onUpdateConnections(otherUserId: $otherUserId, userId: $userId) {
    otherUserId
    userId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateConnectionsSubscriptionVariables,
  APITypes.OnUpdateConnectionsSubscription
>;
export const onDeleteConnections = /* GraphQL */ `subscription OnDeleteConnections($otherUserId: String, $userId: String) {
  onDeleteConnections(otherUserId: $otherUserId, userId: $userId) {
    otherUserId
    userId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteConnectionsSubscriptionVariables,
  APITypes.OnDeleteConnectionsSubscription
>;
export const onCreateLocations = /* GraphQL */ `subscription OnCreateLocations(
  $sessionId: String
  $userId: String
  $latitude: Float
  $longitude: Float
  $timestamp: String
) {
  onCreateLocations(
    sessionId: $sessionId
    userId: $userId
    latitude: $latitude
    longitude: $longitude
    timestamp: $timestamp
  ) {
    sessionId
    userId
    latitude
    longitude
    timestamp
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateLocationsSubscriptionVariables,
  APITypes.OnCreateLocationsSubscription
>;
export const onUpdateLocations = /* GraphQL */ `subscription OnUpdateLocations(
  $sessionId: String
  $userId: String
  $latitude: Float
  $longitude: Float
  $timestamp: String
) {
  onUpdateLocations(
    sessionId: $sessionId
    userId: $userId
    latitude: $latitude
    longitude: $longitude
    timestamp: $timestamp
  ) {
    sessionId
    userId
    latitude
    longitude
    timestamp
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateLocationsSubscriptionVariables,
  APITypes.OnUpdateLocationsSubscription
>;
export const onDeleteLocations = /* GraphQL */ `subscription OnDeleteLocations(
  $sessionId: String
  $userId: String
  $latitude: Float
  $longitude: Float
  $timestamp: String
) {
  onDeleteLocations(
    sessionId: $sessionId
    userId: $userId
    latitude: $latitude
    longitude: $longitude
    timestamp: $timestamp
  ) {
    sessionId
    userId
    latitude
    longitude
    timestamp
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteLocationsSubscriptionVariables,
  APITypes.OnDeleteLocationsSubscription
>;
export const onCreateUserProfiles = /* GraphQL */ `subscription OnCreateUserProfiles(
  $userId: String
  $fullName: String
  $email: AWSEmail
  $identityId: String
  $phoneNumber: AWSPhone
) {
  onCreateUserProfiles(
    userId: $userId
    fullName: $fullName
    email: $email
    identityId: $identityId
    phoneNumber: $phoneNumber
  ) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserProfilesSubscriptionVariables,
  APITypes.OnCreateUserProfilesSubscription
>;
export const onUpdateUserProfiles = /* GraphQL */ `subscription OnUpdateUserProfiles(
  $userId: String
  $fullName: String
  $email: AWSEmail
  $identityId: String
  $phoneNumber: AWSPhone
) {
  onUpdateUserProfiles(
    userId: $userId
    fullName: $fullName
    email: $email
    identityId: $identityId
    phoneNumber: $phoneNumber
  ) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserProfilesSubscriptionVariables,
  APITypes.OnUpdateUserProfilesSubscription
>;
export const onDeleteUserProfiles = /* GraphQL */ `subscription OnDeleteUserProfiles(
  $userId: String
  $fullName: String
  $email: AWSEmail
  $identityId: String
  $phoneNumber: AWSPhone
) {
  onDeleteUserProfiles(
    userId: $userId
    fullName: $fullName
    email: $email
    identityId: $identityId
    phoneNumber: $phoneNumber
  ) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserProfilesSubscriptionVariables,
  APITypes.OnDeleteUserProfilesSubscription
>;
export const onCreateUserTags = /* GraphQL */ `subscription OnCreateUserTags(
  $tagId: String
  $userId: String
  $fullName: String
) {
  onCreateUserTags(tagId: $tagId, userId: $userId, fullName: $fullName) {
    tagId
    userId
    fullName
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserTagsSubscriptionVariables,
  APITypes.OnCreateUserTagsSubscription
>;
export const onUpdateUserTags = /* GraphQL */ `subscription OnUpdateUserTags(
  $tagId: String
  $userId: String
  $fullName: String
) {
  onUpdateUserTags(tagId: $tagId, userId: $userId, fullName: $fullName) {
    tagId
    userId
    fullName
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserTagsSubscriptionVariables,
  APITypes.OnUpdateUserTagsSubscription
>;
export const onDeleteUserTags = /* GraphQL */ `subscription OnDeleteUserTags(
  $tagId: String
  $userId: String
  $fullName: String
) {
  onDeleteUserTags(tagId: $tagId, userId: $userId, fullName: $fullName) {
    tagId
    userId
    fullName
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserTagsSubscriptionVariables,
  APITypes.OnDeleteUserTagsSubscription
>;
export const onCreateParticipants = /* GraphQL */ `subscription OnCreateParticipants(
  $sessionId: String
  $userId: String
  $visibility: String
  $role: String
  $userStatus: String
) {
  onCreateParticipants(
    sessionId: $sessionId
    userId: $userId
    visibility: $visibility
    role: $role
    userStatus: $userStatus
  ) {
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
` as GeneratedSubscription<
  APITypes.OnCreateParticipantsSubscriptionVariables,
  APITypes.OnCreateParticipantsSubscription
>;
export const onCreateOrUpdateParticipants = /* GraphQL */ `subscription OnCreateOrUpdateParticipants(
  $sessionId: String
  $userId: String
  $visibility: String
  $role: String
  $userStatus: String
) {
  onCreateOrUpdateParticipants(
    sessionId: $sessionId
    userId: $userId
    visibility: $visibility
    role: $role
    userStatus: $userStatus
  ) {
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
` as GeneratedSubscription<
  APITypes.OnCreateOrUpdateParticipantsSubscriptionVariables,
  APITypes.OnCreateOrUpdateParticipantsSubscription
>;
export const onUpdateParticipants = /* GraphQL */ `subscription OnUpdateParticipants(
  $sessionId: String
  $userId: String
  $visibility: String
  $role: String
  $userStatus: String
) {
  onUpdateParticipants(
    sessionId: $sessionId
    userId: $userId
    visibility: $visibility
    role: $role
    userStatus: $userStatus
  ) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateParticipantsSubscriptionVariables,
  APITypes.OnUpdateParticipantsSubscription
>;
export const onDeleteParticipants = /* GraphQL */ `subscription OnDeleteParticipants(
  $sessionId: String
  $userId: String
  $visibility: String
  $role: String
  $userStatus: String
) {
  onDeleteParticipants(
    sessionId: $sessionId
    userId: $userId
    visibility: $visibility
    role: $role
    userStatus: $userStatus
  ) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteParticipantsSubscriptionVariables,
  APITypes.OnDeleteParticipantsSubscription
>;
export const onCreateChats = /* GraphQL */ `subscription OnCreateChats(
  $chatId: String
  $timestamp: String
  $messageContent: String
  $senderId: String
  $receiverId: String
) {
  onCreateChats(
    chatId: $chatId
    timestamp: $timestamp
    messageContent: $messageContent
    senderId: $senderId
    receiverId: $receiverId
  ) {
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
` as GeneratedSubscription<
  APITypes.OnCreateChatsSubscriptionVariables,
  APITypes.OnCreateChatsSubscription
>;
export const onUpdateChats = /* GraphQL */ `subscription OnUpdateChats(
  $chatId: String
  $timestamp: String
  $messageContent: String
  $senderId: String
  $receiverId: String
) {
  onUpdateChats(
    chatId: $chatId
    timestamp: $timestamp
    messageContent: $messageContent
    senderId: $senderId
    receiverId: $receiverId
  ) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateChatsSubscriptionVariables,
  APITypes.OnUpdateChatsSubscription
>;
export const onDeleteChats = /* GraphQL */ `subscription OnDeleteChats(
  $chatId: String
  $timestamp: String
  $messageContent: String
  $senderId: String
  $receiverId: String
) {
  onDeleteChats(
    chatId: $chatId
    timestamp: $timestamp
    messageContent: $messageContent
    senderId: $senderId
    receiverId: $receiverId
  ) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteChatsSubscriptionVariables,
  APITypes.OnDeleteChatsSubscription
>;
