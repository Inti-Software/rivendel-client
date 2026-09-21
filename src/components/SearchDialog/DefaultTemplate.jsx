export default function DefaultTemplate({ feedbackClassName, emptyMessage, error, visible }) {
	if (!visible) return null;

	return (
		<span
			className={"rounded-2 border text-center text-black w-auto mx-auto border-1 p-1 " + feedbackClassName}
			style={{ fontSize: "12px" }}
		>
			{error || emptyMessage}
		</span>		
	)
}