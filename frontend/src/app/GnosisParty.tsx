
const GnosisParty = ({ onClick, disabled }: {
  disabled?: boolean;
  onClick: () => void;
}) => {
  return (<button className="w-full h-[42px] relative" disabled={disabled} onClick={onClick}>
    <div className={`w-full h-[42px] absolute left-[-1px] top-[-1px] rounded-[10px] ${disabled ? 'bg-[#DAE881]' : 'bg-[#cddf52]'} `}  >
      <div className='flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 gap-2 px-4 py-3'>
        <svg
          width={23}
          height={22}
          viewBox="0 0 23 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-grow-0 flex-shrink-0 w-[22px] h-[22px]"
          preserveAspectRatio="none"
        >
          <g clipPath="url(#clip0_10_812)">
            <path
              d="M6.96628 12.5267C7.59852 12.5267 8.21534 12.316 8.71394 11.9305L4.7046 7.92114C3.73824 9.17021 3.96955 10.9693 5.21862 11.9356C5.72235 12.316 6.33404 12.5267 6.96628 12.5267Z"
              fill="black"
            />
            <path
              d="M18.8917 9.66343C18.8917 9.03119 18.681 8.41437 18.2955 7.91577L14.2861 11.9251C15.5352 12.8915 17.3291 12.6602 18.2955 11.4111C18.681 10.9125 18.8917 10.2957 18.8917 9.66343Z"
              fill="black"
            />
            <path
              d="M20.9117 5.29956L19.1383 7.07293C20.5673 8.78461 20.3411 11.3341 18.6294 12.7631C17.1285 14.0173 14.9491 14.0173 13.4481 12.7631L11.5 14.7112L9.55701 12.7683C7.84533 14.1972 5.29579 13.9711 3.86682 12.2594C2.61262 10.7584 2.61262 8.579 3.86682 7.07807L2.95701 6.16825L2.09346 5.29956C1.05 7.01638 0.5 8.99021 0.5 11C0.5 17.0757 5.4243 22 11.5 22C17.5757 22 22.5 17.0757 22.5 11C22.5051 8.99021 21.95 7.01638 20.9117 5.29956Z"
              fill="black"
            />
            <path
              d="M19.457 3.40794C15.2678 -0.986918 8.30795 -1.1514 3.91309 3.03785C3.78459 3.16121 3.66122 3.28458 3.543 3.40794C3.27057 3.69579 3.01356 3.99392 2.77197 4.30747L11.5 13.0407L20.228 4.30747C19.9916 3.99392 19.7294 3.69579 19.457 3.40794ZM11.5 1.43925C14.0701 1.43925 16.4654 2.43131 18.2645 4.24065L11.5 11.0051L4.73552 4.24065C6.53459 2.43131 8.92992 1.43925 11.5 1.43925Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_10_812">
              <rect width={22} height={22} fill="white" transform="translate(0.5)" />
            </clipPath>
          </defs>
        </svg>
        <p className="flex-grow-0 flex-shrink-0 text-sm font-bold text-left text-black">
          Party Now! 🎉
        </p>
      </div>
    </div>
  </button >);
};

export default GnosisParty;
