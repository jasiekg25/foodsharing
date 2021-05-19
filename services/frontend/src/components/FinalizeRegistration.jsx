import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";

const FinalizeRegistration = () => {
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");

  useEffect(() => {
    localStorage.setItem("accessToken", token);
    api.finilizeRegistration();
  }, []);

  return <></>;
};

export default FinalizeRegistration;