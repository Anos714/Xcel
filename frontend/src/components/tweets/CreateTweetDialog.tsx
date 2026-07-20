"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

const tweetSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1, "Content is required")
      .max(280, "Tweet cannot exceed 280 characters"),

    hashtags: z.array(z.string()).optional(),

    postType: z.enum(["now", "scheduled"]),

    scheduledFor: z.date().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.postType === "scheduled" && !data.scheduledFor) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a date.",
        path: ["scheduledFor"],
      });
    }
  });

type TweetFormValues = z.infer<typeof tweetSchema>;

export default function CreateTweetDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<TweetFormValues>({
    resolver: zodResolver(tweetSchema),

    defaultValues: {
      content: "",

      hashtags: "",

      postType: "now",

      scheduledFor: null,
    },
  });

  const onSubmit = (values: TweetFormValues) => {
    console.log(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Create Tweet</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Tweet</DialogTitle>
        </DialogHeader>

        {/* Form will come here */}
      </DialogContent>
    </Dialog>
  );
}
