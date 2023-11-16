import { useEffect, useState } from "react";

export default function Chats({ id }) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function getData() {
      const response = await fetch(`/api/firebase-admin/${id}`, {
        method: "POST",
      });

      const data = response;
      console.log(data);
    }
    getData();
  }, []);
  return (
    <div>
      {" "}
      <p>{userData.data}</p>
    </div>
  );
}
