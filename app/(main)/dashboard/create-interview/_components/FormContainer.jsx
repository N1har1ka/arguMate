"use client";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectItem, SelectTrigger, SelectValue,SelectContent } from '@/components/ui/select'
import { AppContext } from "@/context/AppContext";
import { Textarea } from '@/components/ui/textarea'
import { InterviewType } from '@/services/Constants'
import { ArrowRight } from 'lucide-react'
import React, { useEffect, useState, useContext } from 'react'
import { FIELDS, TOPIC_MAP } from './topicMap'

const FormContainer = ({onHandleInputChange,GoToNext}) => {

  // THEME ACCESS
  const { mode } = useContext(AppContext);
  const isDark = mode === "dark";

  // DATA STATES
  const [interviewType,setInterviewType] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  // Field change → update parent
  useEffect(() => {
    onHandleInputChange("field", selectedField || null);
    setSelectedTopic("");
    onHandleInputChange("topic", "");
  }, [selectedField]);

  const topicsForField = selectedField ? TOPIC_MAP[selectedField] || [] : [];

  useEffect(() => {
    onHandleInputChange("topic", selectedTopic || "");
  }, [selectedTopic]);

  useEffect(() => {
    onHandleInputChange("scheduledAt", selectedDateTime || "");
  }, [selectedDateTime]);

  useEffect(() => {
    if (interviewType) {
      onHandleInputChange('type', interviewType)
    }
  }, [interviewType]);

  return (
    <div className={`
      p-5 rounded-xl transition 
      ${isDark ? "bg-gray-900 border border-gray-700 text-gray-100" : "bg-white border border-gray-200 text-gray-900"}
    `}>

      {/* FIELD */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Choose field for debate</h2>
        <Select
          onValueChange={(value) => setSelectedField(value)}
        >
          <SelectTrigger className={`w-full mt-2 ${isDark ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
            <SelectValue placeholder="Select field..." />
          </SelectTrigger>
          <SelectContent className={`${isDark ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
            {FIELDS.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TOPIC BASED ON FIELD */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Choose topic for debate</h2>

        <Select
          onValueChange={(value) => {
            if (value === "no-field") return;
            setSelectedTopic(value);
          }}
        >
          <SelectTrigger className={`w-full mt-2 ${isDark ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
            <SelectValue placeholder={selectedField ? "Choose any topic..." : "Select field first"} />
          </SelectTrigger>

          <SelectContent className={`${isDark ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
            {selectedField ? (
              topicsForField.length > 0 ? (
                topicsForField.map((t, idx) => (
                  <SelectItem key={idx} value={t}>{t}</SelectItem>
                ))
              ) : (
                <SelectItem value="no-topics-available" disabled>No topics available</SelectItem>
              )
            ) : (
              <SelectItem value="no-field" disabled>Select a field first</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* DURATION */}
      <div className='mt-5'>
        <h2 className='text-sm font-medium'>Debate Duration</h2>
        <Select onValueChange={(value)=>onHandleInputChange('duration',value)}>
          <SelectTrigger className={`w-full mt-2 ${isDark ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent className={`${isDark ? "bg-gray-800 text-gray-200" : "bg-white"}`}>
            <SelectItem value="2">2 Minutes</SelectItem>
            <SelectItem value="3">3 Minutes</SelectItem>
            <SelectItem value="5">5 Minutes</SelectItem>
            <SelectItem value="10">10 Minutes</SelectItem>
            <SelectItem value="15">15 Minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* DATE TIME */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Schedule date & time</h2>
        <input
          type="datetime-local"
          value={selectedDateTime}
          onChange={(e) => setSelectedDateTime(e.target.value)}
          className={`
            w-full p-2 rounded-md border mt-2 
            ${isDark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300"}
          `}
        />
      </div>

      {/* INTERVIEW TYPE */}
      <div className="mt-5">
        <h2 className="text-sm font-medium">Debate Type</h2>
        <div className="flex gap-3 flex-wrap mt-2">
          {InterviewType.map((type, index) => (
            <div
              key={index}
              className={`
                flex items-center cursor-pointer gap-2 p-2 px-3 rounded-2xl transition 
                 ${
    interviewType === type.title
      ? isDark
        ? "bg-blue-900/30 border border-blue-400 text-blue-300"   // selected (dark)
        : "bg-blue-50 border border-blue-500 text-blue-700"        // selected (light)
      : isDark
        ? "bg-gray-800 border border-gray-600 hover:bg-gray-700"   // unselected (dark)
        : "bg-white border border-gray-300 hover:bg-gray-100"      // unselected (light)
  }
              `}
              onClick={() => {
                setInterviewType(type.title);
                onHandleInputChange("type", type.title);
              }}
            >
              <type.icon className="w-4 h-4" />
              <span>{type.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* NEXT */}
      <div className="mt-7 flex justify-end">
        <Button className={"cursor-pointer"} onClick={GoToNext}>Generate Debate Points <ArrowRight/></Button>
      </div>

    </div>
  );
}

export default FormContainer;
