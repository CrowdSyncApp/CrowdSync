/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile(
    $userId: ID
    $fullName: String
    $email: AWSEmail
    $phoneNumber: AWSPhone
    $createdAt: AWSDateTime
  ) {
    onCreateUserProfile(
      userId: $userId
      fullName: $fullName
      email: $email
      phoneNumber: $phoneNumber
      createdAt: $createdAt
    ) {
      userId
      fullName
      email
      phoneNumber
      createdAt
      updatedAt
      jobTitle
      company
      profilePicture
      address
      socialLinks
      __typename
    }
  }
`;
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile(
    $userId: ID
    $fullName: String
    $email: AWSEmail
    $phoneNumber: AWSPhone
    $createdAt: AWSDateTime
  ) {
    onUpdateUserProfile(
      userId: $userId
      fullName: $fullName
      email: $email
      phoneNumber: $phoneNumber
      createdAt: $createdAt
    ) {
      userId
      fullName
      email
      phoneNumber
      createdAt
      updatedAt
      jobTitle
      company
      profilePicture
      address
      socialLinks
      __typename
    }
  }
`;
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile(
    $userId: ID
    $fullName: String
    $email: AWSEmail
    $phoneNumber: AWSPhone
    $createdAt: AWSDateTime
  ) {
    onDeleteUserProfile(
      userId: $userId
      fullName: $fullName
      email: $email
      phoneNumber: $phoneNumber
      createdAt: $createdAt
    ) {
      userId
      fullName
      email
      phoneNumber
      createdAt
      updatedAt
      jobTitle
      company
      profilePicture
      address
      socialLinks
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
      __typename
    }
  }
`;
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
export const onCreateChats = /* GraphQL */ `
  subscription OnCreateChats(
    $chatId: String
    $senderIdReceiverIdTimestamp: String
    $messageContent: String
    $ttlExpiration: Int
    $chatTypeStatus: String
  ) {
    onCreateChats(
      chatId: $chatId
      senderIdReceiverIdTimestamp: $senderIdReceiverIdTimestamp
      messageContent: $messageContent
      ttlExpiration: $ttlExpiration
      chatTypeStatus: $chatTypeStatus
    ) {
      chatId
      senderIdReceiverIdTimestamp
      messageContent
      ttlExpiration
      chatTypeStatus
      __typename
    }
  }
`;
export const onUpdateChats = /* GraphQL */ `
  subscription OnUpdateChats(
    $chatId: String
    $senderIdReceiverIdTimestamp: String
    $messageContent: String
    $ttlExpiration: Int
    $chatTypeStatus: String
  ) {
    onUpdateChats(
      chatId: $chatId
      senderIdReceiverIdTimestamp: $senderIdReceiverIdTimestamp
      messageContent: $messageContent
      ttlExpiration: $ttlExpiration
      chatTypeStatus: $chatTypeStatus
    ) {
      chatId
      senderIdReceiverIdTimestamp
      messageContent
      ttlExpiration
      chatTypeStatus
      __typename
    }
  }
`;
export const onDeleteChats = /* GraphQL */ `
  subscription OnDeleteChats(
    $chatId: String
    $senderIdReceiverIdTimestamp: String
    $messageContent: String
    $ttlExpiration: Int
    $chatTypeStatus: String
  ) {
    onDeleteChats(
      chatId: $chatId
      senderIdReceiverIdTimestamp: $senderIdReceiverIdTimestamp
      messageContent: $messageContent
      ttlExpiration: $ttlExpiration
      chatTypeStatus: $chatTypeStatus
    ) {
      chatId
      senderIdReceiverIdTimestamp
      messageContent
      ttlExpiration
      chatTypeStatus
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
export const onCreateUserTags = /* GraphQL */ `
  subscription OnCreateUserTags(
    $sessionId: String
    $userTagId: String
    $userId: String
    $tagId: String
  ) {
    onCreateUserTags(
      sessionId: $sessionId
      userTagId: $userTagId
      userId: $userId
      tagId: $tagId
    ) {
      sessionId
      userTagId
      userId
      tagId
      __typename
    }
  }
`;
export const onUpdateUserTags = /* GraphQL */ `
  subscription OnUpdateUserTags(
    $sessionId: String
    $userTagId: String
    $userId: String
    $tagId: String
  ) {
    onUpdateUserTags(
      sessionId: $sessionId
      userTagId: $userTagId
      userId: $userId
      tagId: $tagId
    ) {
      sessionId
      userTagId
      userId
      tagId
      __typename
    }
  }
`;
export const onDeleteUserTags = /* GraphQL */ `
  subscription OnDeleteUserTags(
    $sessionId: String
    $userTagId: String
    $userId: String
    $tagId: String
  ) {
    onDeleteUserTags(
      sessionId: $sessionId
      userTagId: $userTagId
      userId: $userId
      tagId: $tagId
    ) {
      sessionId
      userTagId
      userId
      tagId
      __typename
    }
  }
`;