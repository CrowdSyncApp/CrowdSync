/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserProfileInput = {
  userId: string,
  fullName: string,
  email: string,
  phoneNumber?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  jobTitle?: string | null,
  company?: string | null,
  profilePicture?: string | null,
  address?: string | null,
  socialLinks?: Array< string | null > | null,
};

export type UserProfile = {
  __typename: "UserProfile",
  userId: string,
  fullName: string,
  email: string,
  phoneNumber?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  jobTitle?: string | null,
  company?: string | null,
  profilePicture?: string | null,
  address?: string | null,
  socialLinks?: Array< string | null > | null,
};

export type UpdateUserProfileInput = {
  userId: string,
  fullName?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  jobTitle?: string | null,
  company?: string | null,
  profilePicture?: string | null,
  address?: string | null,
  socialLinks?: Array< string | null > | null,
};

export type DeleteUserProfileInput = {
  userId: string,
};

export type CreateParticipantsInput = {
  sessionId: string,
  userId: string,
  joinedAt: string,
  role?: string | null,
  jobTitle?: string | null,
  fullName: string,
  company?: string | null,
  visibility: string,
  tags?: Array< string | null > | null,
  sessionStatus: string,
};

export type Participants = {
  __typename: "Participants",
  sessionId: string,
  userId: string,
  joinedAt: string,
  role?: string | null,
  jobTitle?: string | null,
  fullName: string,
  company?: string | null,
  visibility: string,
  tags?: Array< string | null > | null,
  sessionStatus: string,
};

export type UpdateParticipantsInput = {
  sessionId: string,
  userId: string,
  joinedAt?: string | null,
  role?: string | null,
  jobTitle?: string | null,
  fullName?: string | null,
  company?: string | null,
  visibility?: string | null,
  tags?: Array< string | null > | null,
  sessionStatus?: string | null,
};

export type DeleteParticipantsInput = {
  sessionId: string,
  userId: string,
};

export type CreateSessionsInput = {
  sessionId: string,
  startTime: string,
  creatorId: string,
  ownerId: string,
  endTime?: string | null,
  title: string,
  status: string,
};

export type Sessions = {
  __typename: "Sessions",
  sessionId: string,
  startTime: string,
  creatorId: string,
  ownerId: string,
  endTime?: string | null,
  title: string,
  status: string,
};

export type UpdateSessionsInput = {
  sessionId: string,
  startTime?: string | null,
  creatorId?: string | null,
  ownerId?: string | null,
  endTime?: string | null,
  title?: string | null,
  status?: string | null,
};

export type DeleteSessionsInput = {
  sessionId: string,
  startTime: string,
};

export type CreateTagSetInput = {
  tagId: string,
  tag: string,
};

export type TagSet = {
  __typename: "TagSet",
  tagId: string,
  tag: string,
};

export type UpdateTagSetInput = {
  tagId: string,
  tag?: string | null,
};

export type DeleteTagSetInput = {
  tagId: string,
};

export type CreateUserTagsInput = {
  sessionId: string,
  userTagId: string,
  userId: string,
  tagId: string,
};

export type UserTags = {
  __typename: "UserTags",
  sessionId: string,
  userTagId: string,
  userId: string,
  tagId: string,
};

export type UpdateUserTagsInput = {
  sessionId: string,
  userTagId: string,
  userId?: string | null,
  tagId?: string | null,
};

export type DeleteUserTagsInput = {
  sessionId: string,
  userTagId: string,
};

export type CreateChatsInput = {
  senderId: string,
  timestamp: string,
  receiverId: string,
  messageContent: string,
  chatTypeStatus: string,
};

export type Chats = {
  __typename: "Chats",
  senderId: string,
  timestamp: string,
  receiverId: string,
  messageContent: string,
  chatTypeStatus: string,
};

export type UpdateChatsInput = {
  senderId: string,
  timestamp: string,
  receiverId?: string | null,
  messageContent?: string | null,
  chatTypeStatus?: string | null,
};

export type DeleteChatsInput = {
  senderId: string,
  timestamp: string,
};

export type CreateConnectionsInput = {
  otherUserId: string,
  userId: string,
};

export type Connections = {
  __typename: "Connections",
  otherUserId: string,
  userId: string,
};

export type UpdateConnectionsInput = {
  otherUserId: string,
  userId: string,
};

export type DeleteConnectionsInput = {
  otherUserId: string,
  userId: string,
};

export type TableUserProfileFilterInput = {
  userId?: TableIDFilterInput | null,
  fullName?: TableStringFilterInput | null,
  email?: TableStringFilterInput | null,
  phoneNumber?: TableStringFilterInput | null,
  createdAt?: TableStringFilterInput | null,
  updatedAt?: TableStringFilterInput | null,
  jobTitle?: TableStringFilterInput | null,
  company?: TableStringFilterInput | null,
  profilePicture?: TableStringFilterInput | null,
  address?: TableStringFilterInput | null,
  socialLinks?: TableStringFilterInput | null,
};

export type TableIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type TableStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type UserProfileConnection = {
  __typename: "UserProfileConnection",
  items?:  Array<UserProfile | null > | null,
  nextToken?: string | null,
};

export type TableParticipantsFilterInput = {
  sessionId?: TableStringFilterInput | null,
  userId?: TableStringFilterInput | null,
  joinedAt?: TableStringFilterInput | null,
  role?: TableStringFilterInput | null,
  jobTitle?: TableStringFilterInput | null,
  fullName?: TableStringFilterInput | null,
  company?: TableStringFilterInput | null,
  visibility?: TableStringFilterInput | null,
  tags?: TableStringFilterInput | null,
  sessionStatus?: TableStringFilterInput | null,
};

export type ParticipantsConnection = {
  __typename: "ParticipantsConnection",
  items?:  Array<Participants | null > | null,
  nextToken?: string | null,
};

export type TableSessionsFilterInput = {
  sessionId?: TableIDFilterInput | null,
  startTime?: TableStringFilterInput | null,
  creatorId?: TableStringFilterInput | null,
  ownerId?: TableStringFilterInput | null,
  endTime?: TableStringFilterInput | null,
  title?: TableStringFilterInput | null,
  status?: TableStringFilterInput | null,
};

export type SessionsConnection = {
  __typename: "SessionsConnection",
  items?:  Array<Sessions | null > | null,
  nextToken?: string | null,
};

export type TableTagSetFilterInput = {
  tagId?: TableStringFilterInput | null,
  tag?: TableStringFilterInput | null,
};

export type TagSetConnection = {
  __typename: "TagSetConnection",
  items?:  Array<TagSet | null > | null,
  nextToken?: string | null,
};

export type TableUserTagsFilterInput = {
  sessionId?: TableStringFilterInput | null,
  userTagId?: TableStringFilterInput | null,
  userId?: TableStringFilterInput | null,
  tagId?: TableStringFilterInput | null,
};

export type UserTagsConnection = {
  __typename: "UserTagsConnection",
  items?:  Array<UserTags | null > | null,
  nextToken?: string | null,
};

export type TableChatsFilterInput = {
  senderId?: TableStringFilterInput | null,
  timestamp?: TableStringFilterInput | null,
  receiverId?: TableStringFilterInput | null,
  messageContent?: TableStringFilterInput | null,
  chatTypeStatus?: TableStringFilterInput | null,
};

export type ChatsConnection = {
  __typename: "ChatsConnection",
  items?:  Array<Chats | null > | null,
  nextToken?: string | null,
};

export type TableConnectionsFilterInput = {
  otherUserId?: TableStringFilterInput | null,
  userId?: TableStringFilterInput | null,
};

export type ConnectionsConnection = {
  __typename: "ConnectionsConnection",
  items?:  Array<Connections | null > | null,
  nextToken?: string | null,
};

export type CreateUserProfileMutationVariables = {
  input: CreateUserProfileInput,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    userId: string,
    fullName: string,
    email: string,
    phoneNumber?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    jobTitle?: string | null,
    company?: string | null,
    profilePicture?: string | null,
    address?: string | null,
    socialLinks?: Array< string | null > | null,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  input: UpdateUserProfileInput,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    userId: string,
    fullName: string,
    email: string,
    phoneNumber?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    jobTitle?: string | null,
    company?: string | null,
    profilePicture?: string | null,
    address?: string | null,
    socialLinks?: Array< string | null > | null,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  input: DeleteUserProfileInput,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    userId: string,
    fullName: string,
    email: string,
    phoneNumber?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    jobTitle?: string | null,
    company?: string | null,
    profilePicture?: string | null,
    address?: string | null,
    socialLinks?: Array< string | null > | null,
  } | null,
};

export type CreateParticipantsMutationVariables = {
  input: CreateParticipantsInput,
};

export type CreateParticipantsMutation = {
  createParticipants?:  {
    __typename: "Participants",
    sessionId: string,
    userId: string,
    joinedAt: string,
    role?: string | null,
    jobTitle?: string | null,
    fullName: string,
    company?: string | null,
    visibility: string,
    tags?: Array< string | null > | null,
    sessionStatus: string,
  } | null,
};

export type UpdateParticipantsMutationVariables = {
  input: UpdateParticipantsInput,
};

export type UpdateParticipantsMutation = {
  updateParticipants?:  {
    __typename: "Participants",
    sessionId: string,
    userId: string,
    joinedAt: string,
    role?: string | null,
    jobTitle?: string | null,
    fullName: string,
    company?: string | null,
    visibility: string,
    tags?: Array< string | null > | null,
    sessionStatus: string,
  } | null,
};

export type DeleteParticipantsMutationVariables = {
  input: DeleteParticipantsInput,
};

export type DeleteParticipantsMutation = {
  deleteParticipants?:  {
    __typename: "Participants",
    sessionId: string,
    userId: string,
    joinedAt: string,
    role?: string | null,
    jobTitle?: string | null,
    fullName: string,
    company?: string | null,
    visibility: string,
    tags?: Array< string | null > | null,
    sessionStatus: string,
  } | null,
};

export type CreateSessionsMutationVariables = {
  input: CreateSessionsInput,
};

export type CreateSessionsMutation = {
  createSessions?:  {
    __typename: "Sessions",
    sessionId: string,
    startTime: string,
    creatorId: string,
    ownerId: string,
    endTime?: string | null,
    title: string,
    status: string,
  } | null,
};

export type UpdateSessionsMutationVariables = {
  input: UpdateSessionsInput,
};

export type UpdateSessionsMutation = {
  updateSessions?:  {
    __typename: "Sessions",
    sessionId: string,
    startTime: string,
    creatorId: string,
    ownerId: string,
    endTime?: string | null,
    title: string,
    status: string,
  } | null,
};

export type DeleteSessionsMutationVariables = {
  input: DeleteSessionsInput,
};

export type DeleteSessionsMutation = {
  deleteSessions?:  {
    __typename: "Sessions",
    sessionId: string,
    startTime: string,
    creatorId: string,
    ownerId: string,
    endTime?: string | null,
    title: string,
    status: string,
  } | null,
};

export type CreateTagSetMutationVariables = {
  input: CreateTagSetInput,
};

export type CreateTagSetMutation = {
  createTagSet?:  {
    __typename: "TagSet",
    tagId: string,
    tag: string,
  } | null,
};

export type UpdateTagSetMutationVariables = {
  input: UpdateTagSetInput,
};

export type UpdateTagSetMutation = {
  updateTagSet?:  {
    __typename: "TagSet",
    tagId: string,
    tag: string,
  } | null,
};

export type DeleteTagSetMutationVariables = {
  input: DeleteTagSetInput,
};

export type DeleteTagSetMutation = {
  deleteTagSet?:  {
    __typename: "TagSet",
    tagId: string,
    tag: string,
  } | null,
};

export type CreateUserTagsMutationVariables = {
  input: CreateUserTagsInput,
};

export type CreateUserTagsMutation = {
  createUserTags?:  {
    __typename: "UserTags",
    sessionId: string,
    userTagId: string,
    userId: string,
    tagId: string,
  } | null,
};

export type UpdateUserTagsMutationVariables = {
  input: UpdateUserTagsInput,
};

export type UpdateUserTagsMutation = {
  updateUserTags?:  {
    __typename: "UserTags",
    sessionId: string,
    userTagId: string,
    userId: string,
    tagId: string,
  } | null,
};

export type DeleteUserTagsMutationVariables = {
  input: DeleteUserTagsInput,
};

export type DeleteUserTagsMutation = {
  deleteUserTags?:  {
    __typename: "UserTags",
    sessionId: string,
    userTagId: string,
    userId: string,
    tagId: string,
  } | null,
};

export type CreateChatsMutationVariables = {
  input: CreateChatsInput,
};

export type CreateChatsMutation = {
  createChats?:  {
    __typename: "Chats",
    senderId: string,
    timestamp: string,
    receiverId: string,
    messageContent: string,
    chatTypeStatus: string,
  } | null,
};

export type UpdateChatsMutationVariables = {
  input: UpdateChatsInput,
};

export type UpdateChatsMutation = {
  updateChats?:  {
    __typename: "Chats",
    senderId: string,
    timestamp: string,
    receiverId: string,
    messageContent: string,
    chatTypeStatus: string,
  } | null,
};

export type DeleteChatsMutationVariables = {
  input: DeleteChatsInput,
};

export type DeleteChatsMutation = {
  deleteChats?:  {
    __typename: "Chats",
    senderId: string,
    timestamp: string,
    receiverId: string,
    messageContent: string,
    chatTypeStatus: string,
  } | null,
};

export type CreateConnectionsMutationVariables = {
  input: CreateConnectionsInput,
};

export type CreateConnectionsMutation = {
  createConnections?:  {
    __typename: "Connections",
    otherUserId: string,
    userId: string,
  } | null,
};

export type UpdateConnectionsMutationVariables = {
  input: UpdateConnectionsInput,
};

export type UpdateConnectionsMutation = {
  updateConnections?:  {
    __typename: "Connections",
    otherUserId: string,
    userId: string,
  } | null,
};

export type DeleteConnectionsMutationVariables = {
  input: DeleteConnectionsInput,
};

export type DeleteConnectionsMutation = {
  deleteConnections?:  {
    __typename: "Connections",
    otherUserId: string,
    userId: string,
  } | null,
};

export type GetUserProfileQueryVariables = {
  userId: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    userId: string,
    fullName: string,
    email: string,
    phoneNumber?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    jobTitle?: string | null,
    company?: string | null,
    profilePicture?: string | null,
    address?: string | null,
    socialLinks?: Array< string | null > | null,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: TableUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "UserProfileConnection",
    items?:  Array< {
      __typename: "UserProfile",
      userId: string,
      fullName: string,
      email: string,
      phoneNumber?: string | null,
      createdAt?: string | null,
      updatedAt?: string | null,
      jobTitle?: string | null,
      company?: string | null,
      profilePicture?: string | null,
      address?: string | null,
      socialLinks?: Array< string | null > | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetParticipantsQueryVariables = {
  sessionId: string,
  userId: string,
};

export type GetParticipantsQuery = {
  getParticipants?:  {
    __typename: "Participants",
    sessionId: string,
    userId: string,
    joinedAt: string,
    role?: string | null,
    jobTitle?: string | null,
    fullName: string,
    company?: string | null,
    visibility: string,
    tags?: Array< string | null > | null,
    sessionStatus: string,
  } | null,
};

export type ListParticipantsQueryVariables = {
  filter?: TableParticipantsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListParticipantsQuery = {
  listParticipants?:  {
    __typename: "ParticipantsConnection",
    items?:  Array< {
      __typename: "Participants",
      sessionId: string,
      userId: string,
      joinedAt: string,
      role?: string | null,
      jobTitle?: string | null,
      fullName: string,
      company?: string | null,
      visibility: string,
      tags?: Array< string | null > | null,
      sessionStatus: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetSessionsQueryVariables = {
  sessionId: string,
  startTime: string,
};

export type GetSessionsQuery = {
  getSessions?:  {
    __typename: "Sessions",
    sessionId: string,
    startTime: string,
    creatorId: string,
    ownerId: string,
    endTime?: string | null,
    title: string,
    status: string,
  } | null,
};

export type ListSessionsQueryVariables = {
  filter?: TableSessionsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSessionsQuery = {
  listSessions?:  {
    __typename: "SessionsConnection",
    items?:  Array< {
      __typename: "Sessions",
      sessionId: string,
      startTime: string,
      creatorId: string,
      ownerId: string,
      endTime?: string | null,
      title: string,
      status: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetTagSetQueryVariables = {
  tagId: string,
};

export type GetTagSetQuery = {
  getTagSet?:  {
    __typename: "TagSet",
    tagId: string,
    tag: string,
  } | null,
};

export type ListTagSetsQueryVariables = {
  filter?: TableTagSetFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTagSetsQuery = {
  listTagSets?:  {
    __typename: "TagSetConnection",
    items?:  Array< {
      __typename: "TagSet",
      tagId: string,
      tag: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetUserTagsQueryVariables = {
  userTagId: string,
  sessionId: string,
};

export type GetUserTagsQuery = {
  getUserTags?:  {
    __typename: "UserTags",
    sessionId: string,
    userTagId: string,
    userId: string,
    tagId: string,
  } | null,
};

export type ListUserTagsQueryVariables = {
  filter?: TableUserTagsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserTagsQuery = {
  listUserTags?:  {
    __typename: "UserTagsConnection",
    items?:  Array< {
      __typename: "UserTags",
      sessionId: string,
      userTagId: string,
      userId: string,
      tagId: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetChatsQueryVariables = {
  senderId: string,
  timestamp: string,
};

export type GetChatsQuery = {
  getChats?:  {
    __typename: "Chats",
    senderId: string,
    timestamp: string,
    receiverId: string,
    messageContent: string,
    chatTypeStatus: string,
  } | null,
};

export type ListChatsQueryVariables = {
  filter?: TableChatsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChatsQuery = {
  listChats?:  {
    __typename: "ChatsConnection",
    items?:  Array< {
      __typename: "Chats",
      senderId: string,
      timestamp: string,
      receiverId: string,
      messageContent: string,
      chatTypeStatus: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type ListChatsBetweenUsersQueryVariables = {
  userId: string,
  otherUserIds: Array< string | null >,
  chatTypeStatus: string,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChatsBetweenUsersQuery = {
  listChatsBetweenUsers?:  {
    __typename: "ChatsConnection",
    items?:  Array< {
      __typename: "Chats",
      senderId: string,
      timestamp: string,
      receiverId: string,
      messageContent: string,
      chatTypeStatus: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetConnectionsQueryVariables = {
  userId: string,
  otherUserId: string,
};

export type GetConnectionsQuery = {
  getConnections?:  {
    __typename: "Connections",
    otherUserId: string,
    userId: string,
  } | null,
};

export type ListConnectionsQueryVariables = {
  filter?: TableConnectionsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListConnectionsQuery = {
  listConnections?:  {
    __typename: "ConnectionsConnection",
    items?:  Array< {
      __typename: "Connections",
      otherUserId: string,
      userId: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateUserProfileSubscriptionVariables = {
  userId?: string | null,
  fullName?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  createdAt?: string | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    userId: string,
    fullName: string,
    email: string,
    phoneNumber?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    jobTitle?: string | null,
    company?: string | null,
    profilePicture?: string | null,
    address?: string | null,
    socialLinks?: Array< string | null > | null,
  } | null,
};

export type OnUpdateUserProfileSubscriptionVariables = {
  userId?: string | null,
  fullName?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  createdAt?: string | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    userId: string,
    fullName: string,
    email: string,
    phoneNumber?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    jobTitle?: string | null,
    company?: string | null,
    profilePicture?: string | null,
    address?: string | null,
    socialLinks?: Array< string | null > | null,
  } | null,
};

export type OnDeleteUserProfileSubscriptionVariables = {
  userId?: string | null,
  fullName?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  createdAt?: string | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    userId: string,
    fullName: string,
    email: string,
    phoneNumber?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    jobTitle?: string | null,
    company?: string | null,
    profilePicture?: string | null,
    address?: string | null,
    socialLinks?: Array< string | null > | null,
  } | null,
};

export type OnCreateParticipantsSubscriptionVariables = {
  sessionId?: string | null,
  userId?: string | null,
  joinedAt?: string | null,
  role?: string | null,
  jobTitle?: string | null,
};

export type OnCreateParticipantsSubscription = {
  onCreateParticipants?:  {
    __typename: "Participants",
    sessionId: string,
    userId: string,
    joinedAt: string,
    role?: string | null,
    jobTitle?: string | null,
    fullName: string,
    company?: string | null,
    visibility: string,
    tags?: Array< string | null > | null,
    sessionStatus: string,
  } | null,
};

export type OnUpdateParticipantsSubscriptionVariables = {
  sessionId?: string | null,
  userId?: string | null,
  joinedAt?: string | null,
  role?: string | null,
  jobTitle?: string | null,
};

export type OnUpdateParticipantsSubscription = {
  onUpdateParticipants?:  {
    __typename: "Participants",
    sessionId: string,
    userId: string,
    joinedAt: string,
    role?: string | null,
    jobTitle?: string | null,
    fullName: string,
    company?: string | null,
    visibility: string,
    tags?: Array< string | null > | null,
    sessionStatus: string,
  } | null,
};

export type OnDeleteParticipantsSubscriptionVariables = {
  sessionId?: string | null,
  userId?: string | null,
  joinedAt?: string | null,
  role?: string | null,
  jobTitle?: string | null,
};

export type OnDeleteParticipantsSubscription = {
  onDeleteParticipants?:  {
    __typename: "Participants",
    sessionId: string,
    userId: string,
    joinedAt: string,
    role?: string | null,
    jobTitle?: string | null,
    fullName: string,
    company?: string | null,
    visibility: string,
    tags?: Array< string | null > | null,
    sessionStatus: string,
  } | null,
};

export type OnCreateSessionsSubscriptionVariables = {
  sessionId?: string | null,
  startTime?: string | null,
  creatorId?: string | null,
  ownerId?: string | null,
  endTime?: string | null,
};

export type OnCreateSessionsSubscription = {
  onCreateSessions?:  {
    __typename: "Sessions",
    sessionId: string,
    startTime: string,
    creatorId: string,
    ownerId: string,
    endTime?: string | null,
    title: string,
    status: string,
  } | null,
};

export type OnUpdateSessionsSubscriptionVariables = {
  sessionId?: string | null,
  startTime?: string | null,
  creatorId?: string | null,
  ownerId?: string | null,
  endTime?: string | null,
};

export type OnUpdateSessionsSubscription = {
  onUpdateSessions?:  {
    __typename: "Sessions",
    sessionId: string,
    startTime: string,
    creatorId: string,
    ownerId: string,
    endTime?: string | null,
    title: string,
    status: string,
  } | null,
};

export type OnDeleteSessionsSubscriptionVariables = {
  sessionId?: string | null,
  startTime?: string | null,
  creatorId?: string | null,
  ownerId?: string | null,
  endTime?: string | null,
};

export type OnDeleteSessionsSubscription = {
  onDeleteSessions?:  {
    __typename: "Sessions",
    sessionId: string,
    startTime: string,
    creatorId: string,
    ownerId: string,
    endTime?: string | null,
    title: string,
    status: string,
  } | null,
};

export type OnCreateTagSetSubscriptionVariables = {
  tagId?: string | null,
  tag?: string | null,
};

export type OnCreateTagSetSubscription = {
  onCreateTagSet?:  {
    __typename: "TagSet",
    tagId: string,
    tag: string,
  } | null,
};

export type OnUpdateTagSetSubscriptionVariables = {
  tagId?: string | null,
  tag?: string | null,
};

export type OnUpdateTagSetSubscription = {
  onUpdateTagSet?:  {
    __typename: "TagSet",
    tagId: string,
    tag: string,
  } | null,
};

export type OnDeleteTagSetSubscriptionVariables = {
  tagId?: string | null,
  tag?: string | null,
};

export type OnDeleteTagSetSubscription = {
  onDeleteTagSet?:  {
    __typename: "TagSet",
    tagId: string,
    tag: string,
  } | null,
};

export type OnCreateUserTagsSubscriptionVariables = {
  sessionId?: string | null,
  userTagId?: string | null,
  userId?: string | null,
  tagId?: string | null,
};

export type OnCreateUserTagsSubscription = {
  onCreateUserTags?:  {
    __typename: "UserTags",
    sessionId: string,
    userTagId: string,
    userId: string,
    tagId: string,
  } | null,
};

export type OnUpdateUserTagsSubscriptionVariables = {
  sessionId?: string | null,
  userTagId?: string | null,
  userId?: string | null,
  tagId?: string | null,
};

export type OnUpdateUserTagsSubscription = {
  onUpdateUserTags?:  {
    __typename: "UserTags",
    sessionId: string,
    userTagId: string,
    userId: string,
    tagId: string,
  } | null,
};

export type OnDeleteUserTagsSubscriptionVariables = {
  sessionId?: string | null,
  userTagId?: string | null,
  userId?: string | null,
  tagId?: string | null,
};

export type OnDeleteUserTagsSubscription = {
  onDeleteUserTags?:  {
    __typename: "UserTags",
    sessionId: string,
    userTagId: string,
    userId: string,
    tagId: string,
  } | null,
};

export type OnCreateChatsSubscriptionVariables = {
  senderId?: string | null,
  timestamp?: string | null,
  receiverId?: string | null,
  messageContent?: string | null,
  chatTypeStatus?: string | null,
};

export type OnCreateChatsSubscription = {
  onCreateChats?:  {
    __typename: "Chats",
    senderId: string,
    timestamp: string,
    receiverId: string,
    messageContent: string,
    chatTypeStatus: string,
  } | null,
};

export type OnSentReceivedChatsSubscriptionVariables = {
  userId: string,
  otherUserIds: Array< string | null >,
  chatTypeStatus: string,
};

export type OnSentReceivedChatsSubscription = {
  onSentReceivedChats?:  {
    __typename: "Chats",
    senderId: string,
    timestamp: string,
    receiverId: string,
    messageContent: string,
    chatTypeStatus: string,
  } | null,
};

export type OnUpdateChatsSubscriptionVariables = {
  senderId?: string | null,
  timestamp?: string | null,
  receiverId?: string | null,
  messageContent?: string | null,
  chatTypeStatus?: string | null,
};

export type OnUpdateChatsSubscription = {
  onUpdateChats?:  {
    __typename: "Chats",
    senderId: string,
    timestamp: string,
    receiverId: string,
    messageContent: string,
    chatTypeStatus: string,
  } | null,
};

export type OnDeleteChatsSubscriptionVariables = {
  senderId?: string | null,
  timestamp?: string | null,
  receiverId?: string | null,
  messageContent?: string | null,
  chatTypeStatus?: string | null,
};

export type OnDeleteChatsSubscription = {
  onDeleteChats?:  {
    __typename: "Chats",
    senderId: string,
    timestamp: string,
    receiverId: string,
    messageContent: string,
    chatTypeStatus: string,
  } | null,
};

export type OnCreateConnectionsSubscriptionVariables = {
  otherUserId?: string | null,
  userId?: string | null,
};

export type OnCreateConnectionsSubscription = {
  onCreateConnections?:  {
    __typename: "Connections",
    otherUserId: string,
    userId: string,
  } | null,
};

export type OnUpdateConnectionsSubscriptionVariables = {
  otherUserId?: string | null,
  userId?: string | null,
};

export type OnUpdateConnectionsSubscription = {
  onUpdateConnections?:  {
    __typename: "Connections",
    otherUserId: string,
    userId: string,
  } | null,
};

export type OnDeleteConnectionsSubscriptionVariables = {
  otherUserId?: string | null,
  userId?: string | null,
};

export type OnDeleteConnectionsSubscription = {
  onDeleteConnections?:  {
    __typename: "Connections",
    otherUserId: string,
    userId: string,
  } | null,
};
