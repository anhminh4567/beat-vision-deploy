import { HttpClient } from "@/common";
import { useAuthContext } from "@/context";
import { CustomIdentityUserDto } from "@/types/ApplicationTypes/IdentityType";
import { AxiosResponse } from "axios";
import { useState } from "react";

export default function FetchUser() {
  const { isAuthenticated, user, removeSession } = useAuthContext();

  const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);
  const [userData, setUserData] = useState<CustomIdentityUserDto>();
  const Fetch = async () => {
    if (isAuthenticated) {
      try {
        console.log(isAuthenticated);
        const res: AxiosResponse<CustomIdentityUserDto> = await HttpClient.get(
          "/api/ManageIdentity/get-useridentity?id=" + user?.userid
        );
        if (res?.data) {
          console.log(res?.data);
          setUserData(res?.data)
          setFetchSuccess(true);
        }
      } catch (e: any) {
        setFetchSuccess(false);
      }
    }
  };

  return { Fetch, isAuthenticated, fetchSuccess, userData, removeSession };
}
