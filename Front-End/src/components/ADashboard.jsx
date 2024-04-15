import React from "react";

function AdminDashboard() {
  return (
    <div className="flex flex-col grow items-center px-5 pt-5 pb-20 w-full text-3xl leading-10 text-center text-white bg-cyan-700 rounded-none max-md:mt-8">
      <img
        loading="lazy"
        srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&"
        className="self-stretch w-full aspect-[2]"
      />
      <button className="justify-center px-6 py-5 mt-52 max-w-full whitespace-nowrap bg-cyan-700 rounded-md w-[185px] max-md:px-5 max-md:mt-10">Dashboard</button>
      <button className="justify-center px-9 py-4 mt-4 max-w-full bg-cyan-700 rounded-md w-[185px] max-md:px-5">Edit Quiz</button>
      <button className="justify-center px-8 py-5 mt-4 max-w-full whitespace-nowrap bg-cyan-700 rounded-md w-[185px] max-md:px-5">Clinicians</button>
      <button className="justify-center px-8 py-5 mt-2.5 max-w-full whitespace-nowrap bg-cyan-700 rounded-md w-[185px] max-md:px-5">Statistics</button>
      <button className="justify-center px-10 py-4 mt-56 max-w-full whitespace-nowrap bg-cyan-700 rounded-md w-[185px] max-md:px-5 max-md:mt-10">Settings</button>
    </div>
  );
}

export default AdminDashboard;
