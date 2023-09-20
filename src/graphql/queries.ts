/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
export const getLocations = /* GraphQL */ `
  query GetLocations($userId: String!, $sessionId: String!) {
    getLocations(userId: $userId, sessionId: $sessionId) {
      sessionId
      userId
      latitude
      longitude
      timestamp
      __typename
    }
  }
`;
export const listLocations = /* GraphQL */ `
  query ListLocations(
    $filter: TableLocationsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        sessionId
        userId
        latitude
        longitude
        timestamp
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserProfiles = /* GraphQL */ `
  query GetUserProfiles($userId: String!) {
    getUserProfiles(userId: $userId) {
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
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: TableUserProfilesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getUserTags = /* GraphQL */ `
  query GetUserTags($userId: String!, $tagId: String!) {
    getUserTags(userId: $userId, tagId: $tagId) {
      tagId
      userId
      fullName
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
        tagId
        userId
        fullName
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
      userStatus
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
        userStatus
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getChats = /* GraphQL */ `
  query GetChats($chatId: String!, $timestamp: String!) {
    getChats(chatId: $chatId, timestamp: $timestamp) {
      chatId
      timestamp
      messageContent
      senderId
      receiverId
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
        chatId
        timestamp
        messageContent
        senderId
        receiverId
        chatTypeStatus
        __typename
      }
      nextToken
      __typename
    }
  }
`;
