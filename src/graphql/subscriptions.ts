/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateSessions = /* GraphQL */ `
  subscription OnCreateSessions(
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
`;
export const onUpdateSessions = /* GraphQL */ `
  subscription OnUpdateSessions(
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
`;
export const onDeleteSessions = /* GraphQL */ `
  subscription OnDeleteSessions(
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
`;
export const onCreateTagSet = /* GraphQL */ `
  subscription OnCreateTagSet($tagId: String, $tag: String) {
    onCreateTagSet(tagId: $tagId, tag: $tag) {
      tagId
      tag
      __typename
    }
  }
`;
export const onUpdateTagSet = /* GraphQL */ `
  subscription OnUpdateTagSet($tagId: String, $tag: String) {
    onUpdateTagSet(tagId: $tagId, tag: $tag) {
      tagId
      tag
      __typename
    }
  }
`;
export const onDeleteTagSet = /* GraphQL */ `
  subscription OnDeleteTagSet($tagId: String, $tag: String) {
    onDeleteTagSet(tagId: $tagId, tag: $tag) {
      tagId
      tag
      __typename
    }
  }
`;
export const onCreateConnections = /* GraphQL */ `
  subscription OnCreateConnections($otherUserId: String, $userId: String) {
    onCreateConnections(otherUserId: $otherUserId, userId: $userId) {
      otherUserId
      userId
      __typename
    }
  }
`;
export const onUpdateConnections = /* GraphQL */ `
  subscription OnUpdateConnections($otherUserId: String, $userId: String) {
    onUpdateConnections(otherUserId: $otherUserId, userId: $userId) {
      otherUserId
      userId
      __typename
    }
  }
`;
export const onDeleteConnections = /* GraphQL */ `
  subscription OnDeleteConnections($otherUserId: String, $userId: String) {
    onDeleteConnections(otherUserId: $otherUserId, userId: $userId) {
      otherUserId
      userId
      __typename
    }
  }
`;
export const onCreateLocations = /* GraphQL */ `
  subscription OnCreateLocations(
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
`;
export const onUpdateLocations = /* GraphQL */ `
  subscription OnUpdateLocations(
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
`;
export const onDeleteLocations = /* GraphQL */ `
  subscription OnDeleteLocations(
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
`;
export const onCreateUserProfiles = /* GraphQL */ `
  subscription OnCreateUserProfiles(
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
`;
export const onUpdateUserProfiles = /* GraphQL */ `
  subscription OnUpdateUserProfiles(
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
`;
export const onDeleteUserProfiles = /* GraphQL */ `
  subscription OnDeleteUserProfiles(
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
`;
export const onCreateUserTags = /* GraphQL */ `
  subscription OnCreateUserTags(
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
`;
export const onUpdateUserTags = /* GraphQL */ `
  subscription OnUpdateUserTags(
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
`;
export const onDeleteUserTags = /* GraphQL */ `
  subscription OnDeleteUserTags(
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
`;
export const onCreateParticipants = /* GraphQL */ `
  subscription OnCreateParticipants(
    $sessionId: String
    $userId: String
    $joinedAt: AWSDateTime
    $role: String
    $jobTitle: String
  ) {
    onCreateParticipants(
      sessionId: $sessionId
      userId: $userId
      joinedAt: $joinedAt
      role: $role
      jobTitle: $jobTitle
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
`;
export const onUpdateParticipants = /* GraphQL */ `
  subscription OnUpdateParticipants(
    $sessionId: String
    $userId: String
    $joinedAt: AWSDateTime
    $role: String
    $jobTitle: String
  ) {
    onUpdateParticipants(
      sessionId: $sessionId
      userId: $userId
      joinedAt: $joinedAt
      role: $role
      jobTitle: $jobTitle
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
`;
export const onDeleteParticipants = /* GraphQL */ `
  subscription OnDeleteParticipants(
    $sessionId: String
    $userId: String
    $joinedAt: AWSDateTime
    $role: String
    $jobTitle: String
  ) {
    onDeleteParticipants(
      sessionId: $sessionId
      userId: $userId
      joinedAt: $joinedAt
      role: $role
      jobTitle: $jobTitle
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
`;
export const onCreateChats = /* GraphQL */ `
  subscription OnCreateChats(
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
`;
export const onUpdateChats = /* GraphQL */ `
  subscription OnUpdateChats(
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
`;
export const onDeleteChats = /* GraphQL */ `
  subscription OnDeleteChats(
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
`;
