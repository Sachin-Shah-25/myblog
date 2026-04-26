import { useQuery } from "@tanstack/react-query"
import FollowComp from "./FollowComp"
import TrandingTags from "./TrandingTag"
import { fetchUser, getAllFollowers } from "@/app/api/lib/api"
import FullScreenLoader from "../Extra/FullScreenLoader"
import { IoIosSearch } from "react-icons/io";
import { useMemo } from 'react'

import { useState, useEffect } from 'react'
function RightSection() {
  const [getAllFol, setAllFol] = useState(null)
  const [getQuery, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const { data, isPending } = useQuery({
    queryKey: ["followers"],
    queryFn:getAllFollowers,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false
  })

  const filtered = useMemo(() => {
    if (!getQuery) return data
    const result = data.filter((item) =>
      item.nickname?.toLowerCase().includes(getQuery.toLowerCase())
    );
    return result.length > 0 ? result : data
  }, [getQuery,data])
  if (isPending) {
    return <FullScreenLoader></FullScreenLoader>
  }
  return <div className="w-full">

    <div className="border rounded-3xl px-3 flex items-center  top-4">
      <input
        className="w-full py-2 outline-none text-sm"
        placeholder="@sachin"
        value={getQuery}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>

    <div className="mt-4">
      {loading ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
      ) : (
        <FollowComp data={filtered && filtered} />
      )}
    </div>

  </div>
}
export default RightSection