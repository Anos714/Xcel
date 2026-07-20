"use client";

import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TweetFiltersProps {
  search: string;
  status: string;
  type: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onReset: () => void;
}

export default function TweetFilters({
  search,
  status,
  type,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onReset,
}: TweetFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-background p-4 md:flex-row md:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tweets..."
          className="pl-9"
        />
      </div>

      {/* Status */}

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>

          <SelectItem value="pending">Pending</SelectItem>

          <SelectItem value="posted">Posted</SelectItem>

          <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>

      {/* Type */}

      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger className="w-full md:w-44">
          <SelectValue placeholder="Type" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>

          <SelectItem value="custom">Custom</SelectItem>

          <SelectItem value="automation">Automation</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}

      <Button variant="outline" onClick={onReset}>
        <X className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
