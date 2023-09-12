/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($userId: ID!) {
    getUserProfile(userId: $userId) {
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
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: TableUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getParticipants = /* GraphQL */ `
  query GetParticipants($sessionId: String!, $userId: String!) {
    getParticipants(sessionId: $sessionId, userId: $userId) {
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
export const listParticipants = /* GraphQL */ `
  query ListParticipants(
    $filter: TableParticipantsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listParticipants(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getSessions = /* GraphQL */ `
  query GetSessions($sessionId: ID!, $startTime: AWSDateTime!) {
    getSessions(sessionId: $sessionId, startTime: $startTime) {
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
export const listSessions = /* GraphQL */ `
  query ListSessions(
    $filter: TableSessionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        sessionId
        startTime
        creatorId
        ownerId
        endTime
        title
        status
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTagSet = /* GraphQL */ `
  query GetTagSet($tagId: String!) {
    getTagSet(tagId: $tagId) {
      tagId
      tag
      __typename
    }
  }
`;
export const listTagSets = /* GraphQL */ `
  query ListTagSets(
    $filter: TableTagSetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTagSets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        tagId
        tag
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserTags = /* GraphQL */ `
  query GetUserTags($userTagId: String!, $sessionId: String!) {
    getUserTags(userTagId: $userTagId, sessionId: $sessionId) {
      sessionId
      userTagId
      userId
      tagId
      __typename
    }
  }
`;
export const listUserTags = /* GraphQL */ `
  query ListUserTags(
    $filter: TableUserTagsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserTags(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        sessionId
        userTagId
        userId
        tagId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getChats = /* GraphQL */ `
  query GetChats($senderId: String!, $timestamp: String!) {
    getChats(senderId: $senderId, timestamp: $timestamp) {
      senderId
      timestamp
      receiverId
      messageContent
      chatTypeStatus
      __typename
    }
  }
`;
export const listChats = /* GraphQL */ `
  query ListChats(
    $filter: TableChatsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChats(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        senderId
        timestamp
        receiverId
        messageContent
        chatTypeStatus
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listChatsBetweenUsers = /* GraphQL */ `
  query ListChatsBetweenUsers(
    $userId: String!
    $otherUserIds: [String]!
    $chatTypeStatus: String!
    $limit: Int
    $nextToken: String
  ) {
    listChatsBetweenUsers(
      userId: $userId
      otherUserIds: $otherUserIds
      chatTypeStatus: $chatTypeStatus
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        senderId
        timestamp
        receiverId
        messageContent
        chatTypeStatus
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getConnections = /* GraphQL */ `
  query GetConnections($userId: String!, $otherUserId: String!) {
    getConnections(userId: $userId, otherUserId: $otherUserId) {
      otherUserId
      userId
      __typename
    }
  }
`;
export const listConnections = /* GraphQL */ `
  query ListConnections(
    $filter: TableConnectionsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConnections(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        otherUserId
        userId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
