import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface BluetoothLocation {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
}

interface BluetoothContextValue {
  nearbyLocations: BluetoothLocation[];
  pendingChatRoom: { locationId: string; locationName: string } | null;
  acceptChatRoom: (locationId: string, locationName: string) => void;
  rejectChatRoom: () => void;
  simulateLocationDetection: (location: BluetoothLocation) => void;
}

const BluetoothContext = createContext<BluetoothContextValue | null>(null);

// 미리 정의된 위치들
const PREDEFINED_LOCATIONS: BluetoothLocation[] = [
  {
    id: "loc1",
    name: "올림픽공원 콘서트홀",
    category: "콘서트",
    latitude: 37.5226,
    longitude: 127.1227,
  },
  {
    id: "loc2",
    name: "강남 교보문고",
    category: "서점",
    latitude: 37.4979,
    longitude: 127.0276,
  },
  {
    id: "loc3",
    name: "서울 중앙도서관",
    category: "도서관",
    latitude: 37.5665,
    longitude: 126.9779,
  },
  {
    id: "loc4",
    name: "성수 카페거리",
    category: "카페",
    latitude: 37.5446,
    longitude: 127.0569,
  },
  {
    id: "loc5",
    name: "강남 맛집거리",
    category: "맛집",
    latitude: 37.4979,
    longitude: 127.0276,
  },
];

export function BluetoothProvider({ children }: { children: ReactNode }) {
  const [nearbyLocations, setNearbyLocations] = useState<BluetoothLocation[]>([]);
  const [pendingChatRoom, setPendingChatRoom] = useState<{
    locationId: string;
    locationName: string;
  } | null>(null);

  const acceptChatRoom = useCallback((locationId: string, locationName: string) => {
    // 실제 채팅방 생성 로직은 AuthContext에서 처리
    setPendingChatRoom(null);
  }, []);

  const rejectChatRoom = useCallback(() => {
    setPendingChatRoom(null);
  }, []);

  const simulateLocationDetection = useCallback((location: BluetoothLocation) => {
    // 위치 감지 시뮬레이션
    setNearbyLocations((prev) => {
      const exists = prev.some((l) => l.id === location.id);
      return exists ? prev : [...prev, location];
    });

    // 자동으로 채팅방 입장 확인 팝업 표시
    setPendingChatRoom({
      locationId: location.id,
      locationName: location.name,
    });
  }, []);

  const value = useMemo(
    () => ({
      nearbyLocations,
      pendingChatRoom,
      acceptChatRoom,
      rejectChatRoom,
      simulateLocationDetection,
    }),
    [nearbyLocations, pendingChatRoom, acceptChatRoom, rejectChatRoom, simulateLocationDetection],
  );

  return (
    <BluetoothContext.Provider value={value}>{children}</BluetoothContext.Provider>
  );
}

export function useBluetoothContext() {
  const ctx = useContext(BluetoothContext);
  if (!ctx) throw new Error("useBluetoothContext must be used within BluetoothProvider");
  return ctx;
}

export { PREDEFINED_LOCATIONS };
