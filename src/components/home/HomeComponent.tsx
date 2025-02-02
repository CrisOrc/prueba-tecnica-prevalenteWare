"use client";

import HomeCards from "../homeCards/HomeCards";

export default function HomeComponent() {
  return (
    <main className=" flex flex-col justify-center items-center w-full h-screen gap-4">
      <h1 className="text-3xl font-bold text-center">FinFlow</h1>
      <HomeCards />
    </main>
  );
}
