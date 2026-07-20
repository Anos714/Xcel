"use client";

import { MoreHorizontal, Pencil, Sparkles, Trash2 } from "lucide-react";

import { Tweet } from "@/types/tweets";

import TweetStatusBadge from "./TweetStatusBadge";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

interface TweetTableProps {
  tweets: Tweet[];

  onEdit: (tweet: Tweet) => void;

  onDelete: (tweet: Tweet) => void;

  onEnhance: (tweet: Tweet) => void;
}

export default function TweetTable({
  tweets,
  onDelete,
  onEdit,
  onEnhance,
}: TweetTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Content</TableHead>

          <TableHead>Status</TableHead>

          <TableHead>Type</TableHead>

          <TableHead>Scheduled</TableHead>

          <TableHead>Created</TableHead>

          <TableHead className="w-14" />
        </TableRow>
      </TableHeader>

      <TableBody>
        {tweets.map((tweet) => (
          <TableRow key={tweet.id}>
            <TableCell className="max-w-md">
              <p className="line-clamp-2">{tweet.content}</p>
            </TableCell>

            <TableCell>
              <TweetStatusBadge status={tweet.status} />
            </TableCell>

            <TableCell className="capitalize">{tweet.type}</TableCell>

            <TableCell>
              {tweet.scheduledFor
                ? new Date(tweet.scheduledFor).toLocaleString()
                : "-"}
            </TableCell>

            <TableCell>
              {new Date(tweet.createdAt).toLocaleDateString()}
            </TableCell>

            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(tweet)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onEnhance(tweet)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Enhance
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(tweet)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
