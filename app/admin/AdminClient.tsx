"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchReleaseById,
  fetchReleaseOptions,
} from "@/features/releases/api/releases";
import type { Release, ReleaseOption } from "@/features/releases/types";
import { fetchStores } from "@/features/stores/api/stores";
import type { Store } from "@/features/stores/types";

import { AddListingForm } from "@/features/admin/listings/components/AddListingForm";
import { ManageReleaseListings } from "@/features/admin/listings/components/ManageReleaseListings";
import { fetchPendingCandidates } from "@/features/admin/pending/api/pendingCandidates";
import { PendingCandidateList } from "@/features/admin/pending/components/PendingCandidateList";
import type { PendingCandidate } from "@/features/admin/pending/types";
import { CreateReleaseForm } from "@/features/admin/releases/components/CreateReleaseForm";
import { CreateStoreForm } from "@/features/admin/stores/components/CreateStoreForm";
import { StoreList } from "@/features/admin/stores/components/StoreList";

import { useRefreshOnFocus } from "@/shared/hooks/useRefreshOnFocus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RELEASE_OPTIONS_PAGE_SIZE = 10;

export default function AdminClient() {
  const [activeTab, setActiveTab] = useState("create");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMoreReleaseOptions, setIsLoadingMoreReleaseOptions] = useState(false);

  const [releaseOptions, setReleaseOptions] = useState<ReleaseOption[]>([]);
  const [releaseOptionsPage, setReleaseOptionsPage] = useState(1);
  const [releaseOptionsTotalPages, setReleaseOptionsTotalPages] = useState(1);
  const [selectedReleaseId, setSelectedReleaseId] = useState("");
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

  const [stores, setStores] = useState<Store[]>([]);
  const [pendingCandidates, setPendingCandidates] = useState<PendingCandidate[]>([]);
  const [pendingError, setPendingError] = useState<string | null>(null);

  const hasMoreReleaseOptions = releaseOptionsPage < releaseOptionsTotalPages;

  const refreshReleaseOptions = useCallback(async (preferredSelectedId?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchReleaseOptions({
        page: 1,
        pageSize: RELEASE_OPTIONS_PAGE_SIZE,
      });

      setReleaseOptions(data.items);
      setReleaseOptionsPage(data.page);
      setReleaseOptionsTotalPages(data.totalPages);

      if (data.items.length === 0) {
        setSelectedReleaseId("");
        setSelectedRelease(null);
        return;
      }

      const candidateSelectedId =
        preferredSelectedId && data.items.some((item) => item.id === preferredSelectedId)
          ? preferredSelectedId
          : selectedReleaseId && data.items.some((item) => item.id === selectedReleaseId)
            ? selectedReleaseId
            : data.items[0].id;

      setSelectedReleaseId(candidateSelectedId);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "릴리즈 목록을 불러오지 못했습니다.";
      setError(msg);
      setStatus(`오류: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, [selectedReleaseId]);

  const loadMoreReleaseOptions = useCallback(async (): Promise<void> => {
    if (isLoadingMoreReleaseOptions || !hasMoreReleaseOptions) {
      return;
    }

    setIsLoadingMoreReleaseOptions(true);
    setError(null);

    try {
      const nextPage = releaseOptionsPage + 1;
      const data = await fetchReleaseOptions({
        page: nextPage,
        pageSize: RELEASE_OPTIONS_PAGE_SIZE,
      });

      setReleaseOptions((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const nextItems = data.items.filter((item) => !existingIds.has(item.id));
        return [...prev, ...nextItems];
      });
      setReleaseOptionsPage(data.page);
      setReleaseOptionsTotalPages(data.totalPages);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "릴리즈 목록을 더 불러오지 못했습니다.";
      setError(msg);
      setStatus(`오류: ${msg}`);
    } finally {
      setIsLoadingMoreReleaseOptions(false);
    }
  }, [hasMoreReleaseOptions, isLoadingMoreReleaseOptions, releaseOptionsPage]);

  const refreshSelectedRelease = useCallback(async (releaseId: string): Promise<void> => {
    if (!releaseId) {
      setSelectedRelease(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchReleaseById(releaseId);
      setSelectedRelease(data);

      if (!data) {
        setReleaseOptions((prev) => prev.filter((item) => item.id !== releaseId));
        setSelectedReleaseId((prev) => (prev === releaseId ? "" : prev));
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "릴리즈 상세를 불러오지 못했습니다.";
      setError(msg);
      setStatus(`오류: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReleaseDeleted = useCallback(async (): Promise<void> => {
    setSelectedRelease(null);
    await refreshReleaseOptions();
  }, [refreshReleaseOptions]);

  const refreshStores = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchStores();
      setStores(data);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "스토어 목록을 불러오지 못했습니다.";
      setError(msg);
      setStatus(`오류: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshPendingCandidates = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setPendingError(null);

    try {
      const data = await fetchPendingCandidates();
      setPendingCandidates(data);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "pending 후보를 불러오지 못했습니다.";
      setPendingError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshAdminPageData = useCallback(async () => {
    if (activeTab === "pending") {
      await refreshPendingCandidates();
      return;
    }

    if (activeTab === "stores") {
      await refreshStores();
      return;
    }

    await Promise.all([
      refreshReleaseOptions(selectedReleaseId || undefined),
      refreshStores(),
    ]);

    if (selectedReleaseId) {
      await refreshSelectedRelease(selectedReleaseId);
    }
  }, [
    activeTab,
    refreshPendingCandidates,
    refreshReleaseOptions,
    refreshSelectedRelease,
    refreshStores,
    selectedReleaseId,
  ]);

  useRefreshOnFocus({
    refresh: refreshAdminPageData,
  });

  useEffect(() => {
    refreshReleaseOptions();
    refreshStores();
    refreshPendingCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedReleaseId) {
      setSelectedRelease(null);
      return;
    }

    refreshSelectedRelease(selectedReleaseId);
  }, [refreshSelectedRelease, selectedReleaseId]);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">관리자</h1>
      </header>

      {isLoading && releaseOptions.length === 0 && (
        <div className="rounded-xl border p-4 text-sm text-gray-600">
          릴리즈 목록을 불러오는 중...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-full flex-wrap justify-center gap-2 rounded-xl border bg-white p-1">
          <TabsTrigger value="pending" className="shrink-0">
            수집 후보
          </TabsTrigger>

          <TabsTrigger value="create" className="shrink-0">
            데이터 추가
          </TabsTrigger>

          <TabsTrigger
            value="cleanup"
            className="shrink-0 text-red-600 data-[state=active]:bg-red-600 data-[state=active]:text-white"
          >
            수정/삭제
          </TabsTrigger>

          <TabsTrigger value="stores" className="shrink-0">
            스토어 관리
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-10">
          <CreateReleaseForm
            setStatus={setStatus}
            setGlobalLoading={setIsLoading}
            onCreated={async (createdId) => {
              await refreshReleaseOptions(createdId);
              setSelectedReleaseId(createdId);
              await refreshSelectedRelease(createdId);
            }}
          />

          <AddListingForm
            releases={releaseOptions}
            selectedReleaseId={selectedReleaseId}
            onSelectReleaseId={setSelectedReleaseId}
            onRefreshReleaseOptions={refreshReleaseOptions}
            onLoadMoreReleaseOptions={loadMoreReleaseOptions}
            hasMoreReleaseOptions={hasMoreReleaseOptions}
            isLoadingMoreReleaseOptions={isLoadingMoreReleaseOptions}
            onRefreshSelectedRelease={refreshSelectedRelease}
            isLoadingGlobal={isLoading}
            setGlobalLoading={setIsLoading}
            setStatus={setStatus}
          />
        </TabsContent>

        <TabsContent value="cleanup" className="space-y-6">
          <ManageReleaseListings
            releaseOptions={releaseOptions}
            selectedRelease={selectedRelease}
            stores={stores}
            selectedReleaseId={selectedReleaseId}
            onSelectReleaseId={setSelectedReleaseId}
            onRefreshSelectedRelease={refreshSelectedRelease}
            onRefreshReleaseOptions={refreshReleaseOptions}
            onLoadMoreReleaseOptions={loadMoreReleaseOptions}
            hasMoreReleaseOptions={hasMoreReleaseOptions}
            isLoadingMoreReleaseOptions={isLoadingMoreReleaseOptions}
            onReleaseDeleted={handleReleaseDeleted}
            isLoadingGlobal={isLoading}
            setGlobalLoading={setIsLoading}
            setStatus={setStatus}
          />
        </TabsContent>

        <TabsContent value="stores" className="space-y-10">
          <CreateStoreForm
            setStatus={setStatus}
            setGlobalLoading={setIsLoading}
            onCreated={refreshStores}
          />

          <StoreList
            stores={stores}
            onChanged={refreshStores}
            isLoadingGlobal={isLoading}
            setStatus={setStatus}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {pendingError && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              pending 후보를 불러오지 못했습니다. 백엔드 배포나 마이그레이션 상태를 확인해 주세요. ({pendingError})
            </div>
          )}

          <PendingCandidateList
            candidates={pendingCandidates}
            releases={releaseOptions}
            onChanged={refreshPendingCandidates}
            onLoadMoreReleases={loadMoreReleaseOptions}
            hasMoreReleases={hasMoreReleaseOptions}
            isLoadingMoreReleases={isLoadingMoreReleaseOptions}
            isLoadingGlobal={isLoading}
            setGlobalLoading={setIsLoading}
            setStatus={setStatus}
          />
        </TabsContent>
      </Tabs>

      {status && <p className="text-sm font-medium">{status}</p>}
    </div>
  );
}
