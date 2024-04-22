import * as React from "react";

function QuizDashboard() {
  return (
    <div className="pr-7 bg-white max-md:pr-5">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow items-center px-5 pt-5 pb-20 w-full text-3xl leading-10 text-center text-white whitespace-nowrap bg-cyan-700 rounded-none max-md:mt-7">
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/1c50ba5a6c9de558b58040adb10a31736ffb99e6b598092dffcb657304ca79da?apiKey=7e53b2b9b5bd4ba4a4ef59693e5abf04&"
              className="self-stretch w-full aspect-[2]"
            />
            <div className="justify-center px-6 py-5 mt-52 max-w-full bg-cyan-700 rounded-md w-[185px] max-md:px-5 max-md:mt-10">
              Resources
            </div>
            <div className="justify-center px-6 py-5 mt-7 max-w-full bg-cyan-700 rounded-md w-[185px] max-md:px-5">
              Dashboard
            </div>
            <button className="justify-center px-10 py-4 mt-96 max-w-full bg-cyan-700 rounded-md w-[185px] max-md:px-5 max-md:mt-10 text-white">
              Start Quiz
            </button>
          </div>
        </div>
        <div className="flex flex-col ml-5 w-[49%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow px-5 pt-4 pb-11 mt-9 w-full rounded-3xl bg-slate-300 max-md:pr-5 max-md:mt-10 max-md:max-w-full">
            <div className="shrink-0 bg-white rounded-3xl h-[158px] max-md:max-w-full" />
            <div className="px-5 pt-9 pb-3.5 mt-6 bg-white rounded-3xl shadow-sm max-md:px-5 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                <div className="flex flex-col w-[57%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col grow text-black max-md:mt-10">
                    <div className="flex flex-col items-start pr-px pl-16 max-md:pl-5">
                      <div className="text-3xl leading-10">Practice Quiz</div>
                      <div className="mt-1.5 text-base leading-5">
                        The practice quiz must be completed with 8/10 or above
                        to continue to the Final Quiz
                      </div>
                    </div>
                    <button className="justify-center items-center px-5 mt-6 text-3xl leading-10 text-center whitespace-nowrap bg-amber-200 rounded-full h-[51px] w-[51px] text-white">
                      &lt;
                    </button>
                  </div>
                </div>
                <div className="flex flex-col ml-5 w-[43%] max-md:ml-0 max-md:w-full">
                  <div className="text-3xl leading-10 text-black max-md:mt-10">
                    Final Quiz
                  </div>
                </div>
              </div>
            </div>
            <button className="flex flex-col pt-9 pr-5 pb-5 pl-12 mt-8 text-3xl leading-10 text-black bg-white rounded-3xl shadow-sm max-md:pl-5 max-md:max-w-full">
              <div className="max-md:max-w-full">Module 2</div>
              <div className="mt-8 text-base leading-5 max-md:max-w-full">
                To provide information on the mechanisms and physiology of
                transcranial magnetic stimulation (TMS), and its potential side
                effects.
              </div>
              <button className="justify-center items-center self-end px-5 mt-4 text-center whitespace-nowrap bg-amber-200 rounded-full h-[51px] w-[51px] text-white">
                &gt;
              </button>
            </button>
            <button className="flex flex-col pt-9 pr-5 pb-5 pl-12 mt-8 text-3xl leading-10 text-black bg-white rounded-3xl shadow-sm max-md:pl-5 max-md:max-w-full">
              <div className="max-md:max-w-full">Module 3</div>
              <div className="mt-8 text-base leading-5 max-md:max-w-full">
                To provide information on the mechanisms and physiology of
                transcranial magnetic stimulation (TMS), and its potential side
                effects.
              </div>
              <button className="justify-center items-center self-end px-5 mt-4 text-center whitespace-nowrap bg-amber-200 rounded-full h-[51px] w-[51px] text-white">
                &gt;
              </button>
            </button>
          </div>
        </div>
        <div className="flex flex-col ml-5 w-[27%] max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow items-end px-8 pt-5 pb-20 mx-auto mt-6 w-full bg-amber-200 rounded-3xl max-md:px-5 max-md:mt-10">
            <div className="justify-center items-center self-stretch px-16 py-7 text-xl leading-7 text-center text-black bg-white rounded-3xl shadow-sm max-md:px-5">
              Get Certified!
            </div>
            <div className="flex gap-5 mt-48 max-w-full w-[248px] max-md:mt-10">
              <div className="flex-auto my-auto text-3xl leading-10 text-black">
                Module 1
              </div>
              <div className="flex flex-col justify-center items-center rounded-full border border-black border-solid bg-zinc-300 h-[50px] stroke-[1px] w-[50px]">
                <div className="flex flex-col justify-center items-center rounded-full bg-white bg-opacity-0 h-[50px] stroke-[6px] w-[50px]">
                  <div className="shrink-0 rounded-full border-green-500 border-solid bg-white bg-opacity-0 border-[6px] h-[50px] stroke-[6px] w-[50px]" />
                </div>
              </div>
            </div>
            <div className="flex gap-5 mt-4 max-w-full w-[248px]">
              <div className="flex-auto my-auto text-3xl leading-10 text-black">
                Module 2
              </div>
              <div className="flex flex-col justify-center items-center rounded-full bg-zinc-300 h-[50px] w-[50px]">
                <div className="shrink-0 rounded-full border-green-500 border-solid bg-white bg-opacity-0 border-[6px] h-[50px] stroke-[6px] w-[50px]" />
              </div>
            </div>
            <div className="flex gap-5 mt-4 max-w-full w-[248px]">
              <div className="flex-auto my-auto text-3xl leading-10 text-black">
                Module 3
              </div>
              <div className="flex flex-col justify-center items-center rounded-full bg-zinc-300 h-[50px] w-[50px]">
                <div className="shrink-0 rounded-full bg-white bg-opacity-0 h-[50px] stroke-[6px] w-[50px]" />
              </div>
            </div>
            <div className="flex gap-5 mt-4 max-w-full w-[248px]">
              <div className="flex-auto my-auto text-3xl leading-10 text-black">
                Module 4
              </div>
              <div className="flex flex-col justify-center items-center rounded-full bg-zinc-300 h-[50px] w-[50px]">
                <div className="shrink-0 rounded-full bg-white bg-opacity-0 h-[50px] stroke-[6px] w-[50px]" />
              </div>
            </div>
            <div className="flex gap-5 mt-4 max-w-full w-[248px]">
              <div className="flex-auto my-auto text-3xl leading-10 text-black">
                Module 5
              </div>
              <div className="flex flex-col justify-center items-center rounded-full bg-zinc-300 h-[50px] w-[50px]">
                <div className="shrink-0 rounded-full border-white border-solid bg-white bg-opacity-0 border-[6px] h-[50px] stroke-[6px] w-[50px]" />
              </div>
            </div>
            <div className="flex gap-5 mt-4 max-w-full w-[248px]">
              <div className="flex-auto my-auto text-3xl leading-10 text-black">
                Module 6
              </div>
              <div className="flex flex-col justify-center items-center rounded-full bg-zinc-300 h-[50px] w-[50px]">
                <div className="shrink-0 rounded-full border-white border-solid bg-white bg-opacity-0 border-[6px] h-[50px] stroke-[6px] w-[50px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizDashboard;
