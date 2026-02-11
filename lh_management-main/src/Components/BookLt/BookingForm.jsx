import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { lt, clubs, options } from "./data";
import Datepicker from "tailwind-datepicker-react";
import axios from "axios";
import { useSnackbar } from "../SnackBar";

const Form = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { startDate: new Date(), endDate: new Date() },
    timeIn: "18:30",
    timeOut: "22:30",
  });

  const [isAfterInTime, setIsAfterInTime] = useState(false);
  const [show, setShow] = useState(false);
  const [showend, setShowEnd] = useState(false);
  const { showSnackbar } = useSnackbar();
  const baseURL = process.env.REACT_APP_BACKEND_URL;

  const handleStartChange = (selectedDate) => {
    setValue("startDate", selectedDate.toString());
    setValue("endDate", selectedDate.toString());
  };

  const handleEndChange = (selectedDate) => {
    setValue("endDate", selectedDate.toString());
  };

  const handleClose = (state) => {
    setShow(state);
  };

  const handleendClose = (state) => {
    setShowEnd(state);
  };

  const handleTimeChange = (event) => {
    const endTime = event.target.value;
    setIsAfterInTime(endTime >= "22:45" || endTime < "06:00" ? true : false);
  };

  const prepareBookingDetails = (data) => {
    let bookingDetails = {
      ltNumber: data.lectureHall,
      startDate: new Date(data.startDate).toDateString(),
      endDate: new Date(data.endDate).toDateString(),
      reason: data.reason,
      clubName: data.club,
      bookedBy: localStorage.getItem("email"),
      avSupport: data.av ? "yes" : "no",
      startTime: data.timeIn,
      endTime: data.timeOut,
      facultyMentorEmail: "faculty@lnmiit.ac.in",
    };

    if (isAfterInTime) {
      bookingDetails = { ...bookingDetails, pdf: data.pdf };
    }

    return bookingDetails;
  };

  const adjustDateTime = (dateTime, time) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    dateTime.setHours(hours);
    dateTime.setMinutes(minutes);
    dateTime.setSeconds(0);
  };

  const onSubmit = (data) => {
    let bookingDetails = prepareBookingDetails(data);

    const endDate = new Date(bookingDetails.endDate);
    adjustDateTime(endDate, bookingDetails.endTime);

    const startDate = new Date(bookingDetails.startDate);
    adjustDateTime(startDate, bookingDetails.startTime);

    bookingDetails.startDate = startDate;
    bookingDetails.endDate = endDate;

    if (endDate <= startDate) {
      showSnackbar({ message: "Invalid time", useCase: "info" });
      return;
    }

    try {
      axios
        .post(
          `${baseURL}/gsec/makerequest`,
          { ...bookingDetails },
          { withCredentials: true }
        )
        .then((resp) => {
          if (resp.status === 200) {
            if (resp.data.success) {
              showSnackbar({
                message: "Booking Request sent successfully",
                useCase: "success",
              });
            } else {
              showSnackbar({ message: resp.data.msg, useCase: "info" });
            }
          } else {
            showSnackbar({ message: "Try again", useCase: "error" });
          }
        })
        .catch(function (err) {
          showSnackbar({ message: "Try again", useCase: "error" });
        });
    } catch (err) {}
  };

  return (
    <form
      className="flex flex-col items-center gap-4 w-fit border border-gray-300 dark:border-gray-500 rounded-lg  h-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col max-w-[700px] p-5">
        <div className="mb-3">
          <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
            Dates Range
          </label>
          <div className="flex w-full items-center">
            <Datepicker
              options={{ ...options, title: "Start Date" }}
              onChange={handleStartChange}
              show={show}
              setShow={handleClose}
            />
            <input
              hidden
              type="text"
              defaultValue={new Date()}
              {...register("startDate", { required: true })}
            />
            <span className="mx-4 text-gray-500">to</span>
            <Datepicker
              options={{
                ...options,
                minDate: new Date(
                  new Date(getValues("startDate")).toISOString().split("T")[0]
                ),
                title: "End Date",
              }}
              value={
                new Date(getValues("startDate")) >=
                new Date(getValues("endDate"))
                  ? new Date(getValues("startDate"))
                  : new Date(getValues("endDate"))
              }
              onChange={handleEndChange}
              show={showend}
              setShow={handleendClose}
            />
            <input
              hidden
              type="text"
              defaultValue={new Date()}
              {...register("endDate", { required: true })}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
            Time range*
          </label>
          <div className="flex flex-row gap-4 items-center">
            <div>
              <input
                type="time"
                defaultValue="18:30:00"
                placeholder="18:30"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("timeIn", {
                  required: true,
                })}
              />
            </div>
            <span className="mx-4 text-gray-500">to</span>
            <div>
              <input
                type="time"
                defaultValue="22:30:00"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                {...register("timeOut", {
                  onChange: handleTimeChange,
                  required: true,
                })}
              />
            </div>
          </div>
        </div>
        {isAfterInTime && (
          <div className="mb-4">
            <label className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Night extension list*
            </label>
            <input
              type="url"
              className="rounded-md border p-2"
              {...register("pdf", {
                required: isAfterInTime ? true : false,
              })}
            />
          </div>
        )}
        {/* <div className="flex flex-row gap-2">
        <label>Date range</label>
        <DatePicker
          name="dateRange"
          {...register("dateRange", {
            required: true,
          })}
        />
      </div> */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Lecture hall*
          </label>
          <select
            name="lectureHall"
            {...register("lectureHall", {
              required: true,
            })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {lt.map((lt) => {
              return (
                <option value={lt.value} key={lt.value}>
                  {lt.label}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Reason*
          </label>
          <input
            type="text"
            {...register("reason", {
              required: true,
            })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Club*
          </label>
          <select
            name="Club"
            {...register("club", {
              required: true,
            })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {clubs.map((club) => {
              return (
                <option value={club.value} key={club.value}>
                  {club.label}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-row gap-2 items-center mb-2">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            {" "}
            Av support Required?{" "}
          </label>
          <input
            name="avSupport"
            type="checkbox"
            {...register("av")}
            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
          />
        </div>
        <button type="submit" className="bg-blue-500 rounded-md p-2">
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;
