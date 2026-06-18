export function formatPhone(input: string): string {
	let digits = input.replace(/\D/g, "");

	if (digits.startsWith("8")) digits = "7" + digits.slice(1);
	if (digits.startsWith("9")) digits = "7" + digits;
	if (!digits.startsWith("7") && digits.length > 0) digits = "7" + digits;

	digits = digits.slice(0, 11);

	if (digits.length === 0) return "";
	if (digits.length <= 1) return "+7";
	if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
	if (digits.length <= 7) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
	if (digits.length <= 9) return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
	return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
}

export function getPhoneDigits(formatted: string): string {
	return formatted.replace(/\D/g, "");
}
