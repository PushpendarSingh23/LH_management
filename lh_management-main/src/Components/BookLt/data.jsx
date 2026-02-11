export const clubs = [
    { label: "Vignette ", value: "Vignette",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Media Cell", value: "Media Cell",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Sankalp", value: "Sankalp",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Aaveg", value: "Aaveg",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Imagination", value: "Imagination",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Rendition", value: "Rendition",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Quizzinga", value: "Quizzinga",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Capriccio", value: "Capriccio",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Eminence", value: "Eminence",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Literary Committe", value: "Literary Committe",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Insignia", value: "Insignia",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Cultural Council", value: "Cultural Council",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Sci-Tech Council", value: "Sci-Tech Council",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Presidential Council", value: "Presidential Council",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Cipher", value: "Cipher",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Cybros", value: "Cybros",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Phoenix", value: "Phoenix",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    { label: "Astronomy Club", value: "Astronomy Club",facultyMentorEmail:'faculty@lnmiit.ac.in' },
    // { label: "", value: "Club 1087",facultyMentorEmail:'faculty@lnmiit.ac.in' },
  ];
export const lt = [
    { label: "LT1", value: 1 },
    { label: "LT2", value: 2 },
    { label: "LT19", value: 19 },
  ];

export const options = {
	title: "Demo Title",
	autoHide: true,
	todayBtn: false,
	clearBtn: true,
	clearBtnText: "Clear",
	maxDate: new Date("2030-01-01"),
	minDate: new Date(),
	theme: {
		background: "dark:bg-[#374151]",
		todayBtn: "",
		clearBtn: "",
		icons: "",
		text: "",
		disabledText: "text-gray-500",
		input: "",
		inputIcon: "",
		selected: "",
	},
	icons: {
		// () => ReactElement | JSX.Element
		prev: () => <span>&larr;</span>,
		next: () => <span>&rarr;</span>,
	},
	datepickerClassNames: "md:top-12 top-1/2 left-1/2 -translate-x-1/2 ",
	defaultDate: new Date(),
	language: "en",
	disabledDates: [],
	weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
	inputNameProp: "date",
	inputIdProp: "date",
	inputPlaceholderProp: "Select Date",
	inputDateFormatProp: {
		day: "numeric",
		month: "long",
		year: "numeric"
	}
}
