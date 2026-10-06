import type {
  ChatMessage,
  ChatParticipant,
  PaginatedResponse,
} from '@/pages/chat/chat.types';

import axiosInstance from './axiosInstance';

export const getMyChatRoomListAPI = async () => {
  const res =
    await axiosInstance.get<
      PaginatedResponse<{ id: number; room_name: string }>
    >('/chats/rooms/');
  return res.data;
};

export const createNewChatRoomAPI = async (
  id: number,
  participantIds: number[],
) => {
  const res = await axiosInstance.post('/chats/rooms/', {
    room_name: `ChatRoomBy${id}`,
    participant_ids: participantIds,
  });
  return res.data;
};

export const getMyChatRoomDetailAPI = async (roomId: number) => {
  const res = await axiosInstance.get(`/chats/rooms/${roomId}/`);
  return res.data;
};

export const putChatRoomDetailAPI = async (
  roomId: number,
  newRoomName: string,
) => {
  const res = await axiosInstance.put(`/chats/rooms/${roomId}/`, {
    room_name: newRoomName,
  });
  return res.data;
};

export const patchChatRoomDetailAPI = async (
  roomId: number,
  newRoomName?: string,
) => {
  const res = await axiosInstance.put(`/chats/rooms/${roomId}/`, {
    ...(newRoomName ? { room_name: newRoomName } : {}),
  });
  return res.data;
};

export const deleteChatRoomAPI = async (roomId: number) => {
  const res = await axiosInstance.delete(`/chats/rooms/${roomId}/`);
  return res.data;
};

export const joinChatRoomAPI = async (roomId: number, roomName: string) => {
  const res = await axiosInstance.post(`/chats/rooms/${roomId}/join/`, {
    room_name: roomName,
  });
  return res.data;
};

export const leaveChatRoomAPI = async (roomId: number, roomName: string) => {
  const res = await axiosInstance.post(`/chats/rooms/${roomId}/leave/`, {
    room_name: roomName,
  });
  return res.data;
};

export const getChatMessageAPI = async (
  roomId: number,
  page: number,
  beforeId?: number,
  signal?: AbortSignal,
) => {
  const res = await axiosInstance.get<PaginatedResponse<ChatMessage>>(
    `/chats/rooms/${roomId}/messages/`,
    { params: { page, before_id: beforeId }, signal },
  );
  return res.data;
};

export const getChatRoomParticipantsAPI = async (
  roomId: number,
  page: number,
) => {
  const res = await axiosInstance.get<PaginatedResponse<ChatParticipant>>(
    `/chats/rooms/${roomId}/participants/?page=${page}`,
  );
  return res.data;
};

export const sendChatMessageAPI = async (roomId: number, content: string) => {
  const res = await axiosInstance.post<{
    message: ChatMessage;
    reply: ChatMessage;
  }>(`/chats/rooms/${roomId}/messages/`, { content });
  return res.data;
};

export const getGroupMembersAPI = async () => {
  const res = await axiosInstance.get('/groups/members/');
  return res.data;
};
