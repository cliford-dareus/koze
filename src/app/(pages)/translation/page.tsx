"use client";

import { translate } from "@/_actions/translate";
import TextToSpeechButton from "@/components/text-to-speech-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Loader, LucideArrowLeftRight, LucidePlayCircle } from "lucide-react";
import React, { useState } from "react";
import TranslationMananger from "./_components/translation-manager";

type Props = {};

const Translation = (props: Props) => {
  return (
    <div className="">
      <TranslationMananger />
    </div>
  );
};

export default Translation;
