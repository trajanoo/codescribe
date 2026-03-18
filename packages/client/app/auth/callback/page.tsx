'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      await supabase.auth.getSession();
      router.push('/');
    };

    handleAuth();
  }, []);

  return <p>Logging you in...</p>;
}