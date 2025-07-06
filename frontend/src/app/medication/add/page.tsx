"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../store/useAuthStore";
import { useState } from "react";

const schema = yup.object().shape({
  name: yup.string().required("Medication name is required"),
  dosage: yup.string().required("Dosage is required"),
  formType: yup.string().required("Form type is required"),
  scheduleType: yup.string().oneOf(["fixed", "everyXHours", "specificDays", "prn"]).required("Schedule type is required"),
  fixedTimes: yup.array().of(yup.string()).when("scheduleType", {
    is: "fixed",
    then: yup.array().min(1, "At least one time is required"),
    otherwise: yup.array().notRequired(),
  }),
  everyXHours: yup.number().min(1, "Must be at least 1 hour").when("scheduleType", {
    is: "everyXHours",
    then: yup.number().required("Interval is required"),
    otherwise: yup.number().notRequired(),
  }),
  specificDays: yup.array().of(yup.string()).when("scheduleType", {
    is: "specificDays",
    then: yup.array().min(1, "Select at least one day"),
    otherwise: yup.array().notRequired(),
  }),
  prn: yup.boolean().when("scheduleType", {
    is: "prn",
    then: yup.boolean().oneOf([true], "PRN must be true"),
    otherwise: yup.boolean().notRequired(),
  }),
  startDate: yup.date().required("Start date is required"),
  endDate: yup.date().min(yup.ref("startDate"), "End date cannot be before start date").notRequired(),
  refillCount: yup.number().min(0).notRequired(),
  startQuantity: yup.number().min(0).notRequired(),
  doseQuantity: yup.number().min(0).notRequired(),
  timesPerDay: yup.number().min(0).notRequired(),
  notes: yup.string().notRequired(),
  reminderOn: yup.boolean(),
  reminderTime: yup.string().when("reminderOn", {
    is: true,
    then: yup.string().required("Reminder time is required"),
    otherwise: yup.string().notRequired(),
  }),
  reminderRepeat: yup.string().when("reminderOn", {
    is: true,
    then: yup.string().required("Reminder repeat is required"),
    otherwise: yup.string().notRequired(),
  }),
});

type AddMedicationFormInputs = yup.InferType<typeof schema>;

const formTypes = ["Pill", "Injection", "Syrup", "Tablet"];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const reminderRepeats = ["Daily", "Weekly", "Monthly"];

export default function AddMedicationPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AddMedicationFormInputs>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      scheduleType: "fixed",
      fixedTimes: [""],
      prn: false,
      reminderOn: false,
    },
  });

  const scheduleType = watch("scheduleType");
  const reminderOn = watch("reminderOn");

  const onSubmit = async (data: AddMedicationFormInputs) => {
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/medications/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Failed to add medication");
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Add medication failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Medication</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-1">Medication Name</label>
          <input
            id="name"
            type="text"
            {...register("name")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="dosage" className="block mb-1">Dosage</label>
          <input
            id="dosage"
            type="text"
            {...register("dosage")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.dosage && <p className="text-red-600 text-sm mt-1">{errors.dosage.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="formType" className="block mb-1">Form Type</label>
          <select
            id="formType"
            {...register("formType")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            {formTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.formType && <p className="text-red-600 text-sm mt-1">{errors.formType.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Schedule Type</label>
          <select
            {...register("scheduleType")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="fixed">Fixed time(s) per day</option>
            <option value="everyXHours">Every X hours</option>
            <option value="specificDays">Specific days</option>
            <option value="prn">PRN (as needed)</option>
          </select>
          {errors.scheduleType && <p className="text-red-600 text-sm mt-1">{errors.scheduleType.message}</p>}
        </div>
        {scheduleType === "fixed" && (
          <div className="mb-4">
            <label className="block mb-1">Fixed Times</label>
            <input
              type="time"
              {...register("fixedTimes.0")}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.fixedTimes && <p className="text-red-600 text-sm mt-1">{errors.fixedTimes.message}</p>}
          </div>
        )}
        {scheduleType === "everyXHours" && (
          <div className="mb-4">
            <label htmlFor="everyXHours" className="block mb-1">Every X Hours</label>
            <input
              id="everyXHours"
              type="number"
              min={1}
              {...register("everyXHours")}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.everyXHours && <p className="text-red-600 text-sm mt-1">{errors.everyXHours.message}</p>}
          </div>
        )}
        {scheduleType === "specificDays" && (
          <div className="mb-4">
            <label className="block mb-1">Specific Days</label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <label key={day} className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={day}
                    {...register("specificDays")}
                    className="form-checkbox"
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
            {errors.specificDays && <p className="text-red-600 text-sm mt-1">{errors.specificDays.message}</p>}
          </div>
        )}
        {scheduleType === "prn" && (
          <div className="mb-4">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("prn")}
                className="form-checkbox"
              />
              <span>PRN (as needed)</span>
            </label>
            {errors.prn && <p className="text-red-600 text-sm mt-1">{errors.prn.message}</p>}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="startDate" className="block mb-1">Start Date</label>
          <input
            id="startDate"
            type="date"
            {...register("startDate")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block mb-1">End Date (optional)</label>
          <input
            id="endDate"
            type="date"
            {...register("endDate")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="refillCount" className="block mb-1">Refill Count (optional)</label>
          <input
            id="refillCount"
            type="number"
            min={0}
            {...register("refillCount")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.refillCount && <p className="text-red-600 text-sm mt-1">{errors.refillCount.message}</p>}
        </div>
+        <div className="mb-4">
+          <label htmlFor="startQuantity" className="block mb-1">Number of Pills at Start</label>
+          <input
+            id="startQuantity"
+            type="number"
+            min={0}
+            {...register("startQuantity")}
+            className="w-full border border-gray-300 rounded px-3 py-2"
+          />
+          {errors.startQuantity && <p className="text-red-600 text-sm mt-1">{errors.startQuantity.message}</p>}
+        </div>
+        <div className="mb-4">
+          <label htmlFor="doseQuantity" className="block mb-1">Pills per Dose</label>
+          <input
+            id="doseQuantity"
+            type="number"
+            min={0}
+            {...register("doseQuantity")}
+            className="w-full border border-gray-300 rounded px-3 py-2"
+          />
+          {errors.doseQuantity && <p className="text-red-600 text-sm mt-1">{errors.doseQuantity.message}</p>}
+        </div>
+        <div className="mb-4">
+          <label htmlFor="timesPerDay" className="block mb-1">Times per Day</label>
+          <input
+            id="timesPerDay"
+            type="number"
+            min={0}
+            {...register("timesPerDay")}
+            className="w-full border border-gray-300 rounded px-3 py-2"
+          />
+          {errors.timesPerDay && <p className="text-red-600 text-sm mt-1">{errors.timesPerDay.message}</p>}
+        </div>
        <div className="mb-4">
          <label htmlFor="notes" className="block mb-1">Notes / Instructions</label>
          <textarea
            id="notes"
            {...register("notes")}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
          {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes.message}</p>}
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("reminderOn")}
              className="form-checkbox"
            />
            <span>Enable Reminder</span>
          </label>
        </div>
        {reminderOn && (
          <>
            <div className="mb-4">
              <label htmlFor="reminderTime" className="block mb-1">Reminder Time</label>
              <input
                id="reminderTime"
                type="time"
                {...register("reminderTime")}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.reminderTime && <p className="text-red-600 text-sm mt-1">{errors.reminderTime.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="reminderRepeat" className="block mb-1">Reminder Repeat</label>
              <select
                id="reminderRepeat"
                {...register("reminderRepeat")}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                {reminderRepeats.map((repeat) => (
                  <option key={repeat} value={repeat}>{repeat}</option>
                ))}
              </select>
              {errors.reminderRepeat && <p className="text-red-600 text-sm mt-1">{errors.reminderRepeat.message}</p>}
            </div>
          </>
        )}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Medication"}
        </button>
      </form>
    </div>
  );
}
