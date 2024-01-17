import React, { useEffect, useRef, useState, forwardRef } from "react";
import { useNotification } from "../../hooks";
import { getLatestUploads } from "../../api/movie";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { Link } from "react-router-dom";

let count = 0;
let intervalId;
const HeroSlideShow = () => {
  //Use F2 to change state everywhere in file
  //To Store info about movie
  const [currentSlide, setCurrentSlide] = useState({});
  const [clonedSlide, setClonedSlide] = useState({});

  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [upNext, setUpNext] = useState([]);

  const [visible, setVisible] = useState(true);

  const { updateNotification } = useNotification();

  const slideRef = useRef();
  const clonedSlideRef = useRef();
  const fetchLatestUploads = async () => {
    const { error, movies } = await getLatestUploads();
    if (error) return updateNotification();

    setSlides([...movies]);
    setCurrentSlide(movies[0]);
  };

  const updateUpNext = (currentIndex) => {
    if (!slides.length) return;

    //To render 3 items on right side
    const upNextCount = currentIndex + 1;
    const end = upNextCount + 3;

    /* Array slice revision
      const arr = ["a", "b", "c", "d", "e"]
      array slice ==> start -> INDEX Based end -> LENGTH Based
      [...arr].slice(0,3) = ["a", "b", "c"],
      [...arr].slice(1,3) = ["b", "c"],
      [...arr].slice(1,4) = ["b", "c", "d"],
      [...arr].slice(1,5) = ["b", "c", "d", "e"],
      [...arr].slice(2,5) = ["c", "d", "e"],
      [...arr].slice(3,5) = ["d", "e"],
      [...arr].slice(4,5) = ["e"],
      [...arr].slice(5,5) = [],

     */
    let newSlides = [...slides];
    newSlides = newSlides.slice(upNextCount, end);
    if (!newSlides.length) {
      //Rest values from start
      newSlides = [...slides].slice(0, 3);
    }
    setUpNext([...newSlides]);
  };
  //Curretn index 0,1,2,3,4 if go beyond 4 it will throw a error
  const handleOnNextClick = () => {
    pauseSlideShow();
    //Prev slide
    setClonedSlide(slides[count]);
    // const nextSlideIndex = currentIndex + 1;
    count = (count + 1) % slides.length;
    setCurrentSlide(slides[count]);

    // setCurrentIndex(count);

    //Old Image out animation class
    clonedSlideRef.current.classList.add("slide-out-to-left");
    //New Image in Animation class
    slideRef.current.classList.add("slide-in-from-right");
    updateUpNext(count);
  };

  const handleOnPrevClick = () => {
    pauseSlideShow();
    setClonedSlide(slides[count]);
    //Reverse count 0 t0 slides.length
    count = (count + slides.length - 1) % slides.length;
    setCurrentSlide(slides[count]);

    // setCurrentIndex(count);

    clonedSlideRef.current.classList.add("slide-out-to-right");
    slideRef.current.classList.add("slide-in-from-left");
    updateUpNext(count);
  };

  const handleAnimationEnd = () => {
    const classes = [
      "slide-out-to-left",
      "slide-in-from-right",
      "slide-out-to-right",
      "slide-in-from-left",
    ];
    slideRef.current.classList.remove(...classes);
    clonedSlideRef.current.classList.remove(...classes);
    setClonedSlide({});
    startSlideShow();
  };

  const startSlideShow = () => {
    //slide show animation for every 3.5s
    intervalId = setInterval(handleOnNextClick, 3500);
  };

  const pauseSlideShow = () => {
    //pause slide show animation
    clearInterval(intervalId);
  };

  const handleOnVisibilityChange = () => {
    //If tab is open -> visible, close -> hidden
    // console.log(document.visibilityState);
    const visibility = document.visibilityState;
    if (visibility === "hidden") setVisible(false);
    if (visibility === "visible") setVisible(true);
  };
  useEffect(() => {
    fetchLatestUploads();
    //To stop animation when change or close tab
    document.addEventListener("visibilitychange", handleOnVisibilityChange);
    //Clean up fun -> runs when unmounts the dom
    return () => {
      // console.log("Unmount");
      pauseSlideShow();
      document.removeEventListener(
        "visibilitychange",
        handleOnVisibilityChange
      );
    };
  }, []);

  useEffect(() => {
    if (slides.length && visible) {
      startSlideShow();
      updateUpNext(count);
    } else {
      pauseSlideShow();
    }
  }, [slides.length, visible]);

  return (
    <div className="flex w-full">
      {/*Slider show section */}
      <div className="w-4/5 aspect-video relative overflow-hidden">
        {/*Current  Slide*/}
        {/* <div className="cursor-pointer w-full">
          <img
            ref={slideRef}
            src={currentSlide.poster}
            className="aspect-video object-cover"
            alt={currentSlide.title}
            // onAnimationEnd={handleAnimationEnd}
          />
          <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white dark:from-primary">
            <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
              {currentSlide.title}
            </h1>
          </div>
        </div>*/}
        <Slide
          title={currentSlide.title}
          src={currentSlide.poster}
          ref={slideRef}
          id={currentSlide.id}
        />
        {/*Clonned Slide*/}
        {
          <Slide
            ref={clonedSlideRef}
            onAnimationEnd={handleAnimationEnd}
            className="absolute inset-0"
            src={clonedSlide.poster}
            title={clonedSlide.title}
            id={currentSlide.id}
          />
        }
        <SlideShowController
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPrevClick}
        />
      </div>
      {/*Up next section */}
      <div className="w-1/5 space-y-3 px-3">
        <h1 className="font-semibold text-2xl text-primary dark:text-white">
          Up Next
        </h1>
        {upNext.map(({ poster, id }) => {
          return (
            <img
              key={id}
              src={poster}
              className="aspect-video object-cover rounded"
            />
          );
        })}
      </div>
    </div>
  );
};

export default HeroSlideShow;

const SlideShowController = ({ onNextClick, onPrevClick }) => {
  const btnClass =
    "bg-primary rounded border-2 text-white text-xl p-2 outline-none";
  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
      <button onClick={onPrevClick} className={btnClass} type="button">
        <AiOutlineDoubleLeft />
      </button>
      <button onClick={onNextClick} className={btnClass} type="button">
        <AiOutlineDoubleRight />
      </button>
    </div>
  );
};

const Slide = forwardRef((props, ref) => {
  const { id, title, src, className = "", ...rest } = props;
  //Link will work inLine by default
  return (
    <Link
      to={"/movie/" + id}
      ref={ref}
      className={"cursor-pointer w-full block " + className}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          className="aspect-video object-cover"
          alt=""
          // onAnimationEnd={handleAnimationEnd}
        />
      ) : null}
      {title ? (
        <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white via-transparent dark:from-primary dark:via-transparent">
          <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
            {title}
          </h1>
        </div>
      ) : null}
    </Link>
  );
});
