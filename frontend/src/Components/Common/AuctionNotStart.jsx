import React from 'react'

const AuctionNotStart = () => {
  return (
    <>
        <div className="flex items-center gap-2 border border-slate-300 hover:border-slate-400/70 rounded-full w-max mx-auto px-4 py-2 mt-40 md:mt-32">
        <span>To Know More Information</span>
        <button className="flex items-center gap-1 font-medium">
            <span>Read more</span>
            <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.959 9.5h11.083m0 0L9.501 3.958M15.042 9.5l-5.541 5.54" stroke="#050040" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>
    </div>
    <h5 className="text-4xl md:text-7xl font-medium max-w-[850px] text-center mx-auto mt-8">
        Auction Will Be Start In Few Minutes
    </h5>

    <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-6 max-md:px-2">An auction is a process where items are sold to the person who offers the highest price.
The final price is decided based on competition among participants within a limited time.</p>

    <div className="mx-auto w-full flex items-center justify-center gap-3 mt-4">
        
        <button className="flex items-center gap-2 border border-slate-300 hover:bg-slate-200/30 rounded-full px-6 py-3">
            <span>Learn More</span>
            <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.25.5 4.75 4l-3.5 3.5" stroke="#050040" stroke-opacity=".4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </button>
    </div>
    </>
  )
}

export default AuctionNotStart
