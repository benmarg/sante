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

import ContactList from "~/componenets/ContactList";

const Home: NextPage = () => {
  function Form() {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<CreateContactInput>({
      resolver: zodResolver(schema),
    });

    const { mutate, status, error } = api.contact.create.useMutation();

    return (
      <form
        onSubmit={handleSubmit((data) => mutate(data))}
        className="flex flex-col gap-6"
      >
        <input
          {...register("name")}
          placeholder="Name"
          className="flex rounded-md p-1 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
        />
        <input
          {...register("email")}
          placeholder="Email Address"
          className="flex rounded-md p-1 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md"
        />
        <input
          {...register("phoneNumber")}
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
          <span className="text-red-600">
            Please Enter A Valid Phone Number
          </span>
        )}
        {!errors.name && !errors.email && !errors.phoneNumber && <span> </span>}
        <input
          className="w-72 rounded-md bg-indigo-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          type="submit"
        />
      </form>
    );
  }

  return (
    <>
      <Head>
        <title>Sante Contact List</title>
        <meta
          name="description"
          content="A contact list to keep track of your favorite contacts!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="mx-auto">
        <h1 className="text-4xl font-bold">Sante Contact List</h1>
        <div className="flex min-h-screen items-center justify-evenly">
          <Form />
          <div className="h-96 w-96">
            <ContactList />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
