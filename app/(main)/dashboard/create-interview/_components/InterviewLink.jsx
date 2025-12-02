"use client";
import { useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Calendar, Clock, Copy, Mail, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { AppContext } from "@/context/AppContext";

const InterviewLink = ({ interview_id, formData }) => {
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  const url = process.env.NEXT_PUBLIC_HOST_URL + "/" + interview_id;

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(url);
    toast("Link copied");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center mt-10 transition-colors duration-300 ${
        isDark ? "text-gray-100" : "text-gray-900"
      }`}
    >
      {/* Check Icon */}
      <Image
        src={"/check.png"}
        alt="check"
        width={50}
        height={50}
        className="w-[50px] h-[50px]"
      />

      <h2 className="font-bold text-lg mt-4">Your Debate is Scheduled!</h2>
      <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mt-3`}>
        Share this link with your participants to start the debate.
      </p>

      {/* Debate Link Box */}
      <div
        className={`w-full p-7 mt-6 rounded-xl border transition-colors duration-300 ${
          isDark
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-300 shadow"
        }`}
      >
        <div className="flex justify-between items-center">
          <h2 className="font-bold">Debate Link</h2>

          {/* <h2
            className={`p-1 px-2 rounded-2xl text-sm ${
              isDark
                ? "bg-blue-900/40 text-blue-300 border border-blue-800"
                : "text-primary bg-blue-50"
            }`}
          >
            Valid for 30 Days
          </h2> */}
        </div>

        {/* URL + COPY */}
        <div className="mt-3 flex gap-3">
          <Input
            defaultValue={url}
            disabled={true}
            className={`transition-colors duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-100"
                : "bg-gray-50 border-gray-300 text-gray-900"
            }`}
          />

          <Button
            onClick={onCopyLink}
            className="flex gap-1 items-center whitespace-nowrap cursor-pointer"
          >
            <Copy size={16} /> Copy Link
          </Button>
        </div>

        <hr className={`my-7 ${isDark ? "border-gray-700" : "border-gray-300"}`} />

        <div className="flex gap-5">
          <h2
            className={`text-sm flex gap-2 items-center ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Clock className="h-4 w-4" />
            {formData?.duration} Minutes
          </h2>
        </div>
      </div>

      {/* Share Options */}
      <div
        className={`mt-7 p-5 rounded-lg w-full border transition-colors duration-300 ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        <h2 className="font-bold">Share via</h2>

        <div className="flex gap-7 mt-2">
          <Button variant="outline" className="flex gap-2 items-center">
            <Mail size={16} /> Email
          </Button>
          <Button variant="outline" className="flex gap-2 items-center">
            <Mail size={16} /> Slack
          </Button>
          <Button variant="outline" className="flex gap-2 items-center">
            <Mail size={16} /> Whatsapp
          </Button>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex w-full gap-5 justify-between mt-6 mb-4">
        <Link href={"/dashboard"}>
          <Button variant={"outline"} className="flex gap-2 items-center cursor-pointer">
            <ArrowLeft size={16} /> Back to Dashboard
          </Button>
        </Link>

        <Link href={"/dashboard/create-interview"}>
          <Button className="flex gap-2 items-center cursor-pointer">
            <Plus size={16} /> Create New Debate
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewLink;
