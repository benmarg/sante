import { api } from "~/utils/api";
import { useMemo, useState } from "react";
import { type Contact } from "@prisma/client";
import UpdateModal from "~/componenets/UpdateModal";

export default function ContactList() {
  const [updateModelOpen, setUpdateModelOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | undefined>();

  const { data } = api.contact.getAll.useQuery();

  const directory = useMemo(() => {
    const directory = data?.reduce((acc, person) => {
      const letter = person.name[0].toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(person);
      return acc;
    }, {} as Record<string, typeof data>);
    return directory;
  }, [data]);

  const apiContext = api.useContext();

  const { mutate, status, error } = api.contact.delete.useMutation({
    onSuccess() {
      return apiContext.contact.getAll.invalidate();
    },
  });

  return (
    <>
      {updateModelOpen && (
        <UpdateModal
          onClose={() => setUpdateModelOpen(false)}
          contact={currentContact!}
        />
      )}
      {directory && (
        <nav className="h-full overflow-y-auto" aria-label="Directory">
          {Object.keys(directory)
            .sort()
            .map((letter) => (
              <div key={letter} className="relative">
                <div className="sticky top-0 z-10 border-y border-b-gray-200 border-t-gray-100 bg-gray-50 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900">
                  <h3>{letter}</h3>
                </div>
                <ul role="list" className="divide-y divide-gray-100">
                  {directory[letter]?.map((person) => (
                    <li key={person.email} className="flex gap-x-4 px-3 py-5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-400 font-bold">
                        {person.name[0].toUpperCase()}
                        {person?.name.split(" ")[1]?.[0]?.toUpperCase() || ""}
                      </div>
                      <div className="w-full min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-semibold leading-6 text-gray-900">
                            {person.name}
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="mr-2 h-6 w-6"
                            onClick={() => mutate(person.id)}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </div>
                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                          {person.email}
                        </p>
                        <div className="flex justify-between">
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                            {person.phoneNumber}
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="mr-2 h-6 w-6"
                            onClick={() => {
                              setCurrentContact(person);
                              setUpdateModelOpen(true);
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </nav>
      )}
    </>
  );
}
