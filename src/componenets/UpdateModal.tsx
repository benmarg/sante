import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import validator from "validator";
import {
  createContactSchema as schema,
  type CreateContactInput,
} from "~/validations/contacts";
import { contactRouter } from "~/server/api/routers/contact";
import { type Contact } from "@prisma/client";

function Form({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateContactInput>({
    resolver: zodResolver(schema),
    defaultValues: { ...contact },
  });

  const apiContext = api.useContext();
  const { mutate, status, error } = api.contact.update.useMutation({
    onSuccess() {
      return apiContext.contact.getAll.invalidate();
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) =>
        mutate(
          { ...data, id: contact.id },
          {
            onSuccess() {
              onClose();
            },
          }
        )
      )}
      className="flex flex-col gap-6"
    >
      <input
        {...register("name")}
        placeholder="Name"
        type="text"
        className="flex rounded-md p-1 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
      />
      <input
        {...register("email")}
        placeholder="Email Address"
        type="email"
        className="flex rounded-md p-1 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
      />
      <input
        {...register("phoneNumber")}
        type="tel"
        placeholder="Phone Number"
        className="flex rounded-md p-1 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
      />
      {errors.name && (
        <span className="text-red-600">{errors.name.message}</span>
      )}
      {errors.email && (
        <span className="text-red-600">{errors.email.message}</span>
      )}
      {errors.phoneNumber && (
        <span className="text-red-600">Please Enter A Valid Phone Number</span>
      )}
      {error && <span className="text-red-600">{error.message}</span>}
      {!errors.name && !errors.email && !errors.phoneNumber && <span> </span>}
      <input
        className="w-72 rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        type="submit"
      />
    </form>
  );
}

export default function UpdateModal({
  onClose,
  contact,
}: {
  onClose: () => void;
  contact: Contact;
}) {
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}

      <div
        aria-live="assertive"
        className="pointer-events-none fixed z-50 flex w-96 items-center align-middle"
      >
        <div className="z-30 flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={true}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start gap-3 ">
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="mb-4  text-center text-sm font-medium text-gray-900">
                      Update your contact!
                    </p>
                    <Form contact={contact} onClose={onClose} />
                    <p className="text-sm font-medium text-gray-900"> </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        onClose();
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
