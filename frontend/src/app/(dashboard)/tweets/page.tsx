"use client";

import { useState } from "react";

import CreateTweetDialog from "@/components/tweets/CreateTweetDialog";
import TweetFilters from "@/components/tweets/TweetFilters";
import TweetTable from "@/components/tweets/TweetTable";

import { useTweets } from "@/hooks/useTweets";

export default function TweetsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTweets({
    page,
    limit: 10,
    search: search || undefined,
    status:
      status === "all"
        ? undefined
        : (status as "pending" | "posted" | "failed"),
    type: type === "all" ? undefined : (type as "custom" | "automation"),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tweets</h1>

          <p className="text-muted-foreground">
            Create, manage and schedule your tweets.
          </p>
        </div>

        <CreateTweetDialog />
      </div>

      {/* Filters */}
      <TweetFilters
        search={search}
        status={status}
        type={type}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onTypeChange={setType}
        onReset={() => {
          setSearch("");
          setStatus("all");
          setType("all");
          setPage(1);
        }}
      />

      {/* Table */}
      <TweetTable
        tweets={data?.data.data ?? []}
        onEdit={(tweet) => console.log(tweet)}
        onDelete={(tweet) => console.log(tweet)}
        onEnhance={(tweet) => console.log(tweet)}
      />

      {/* Pagination yahan aayegi */}
    </div>
  );
}
