export default function testEmail (email: string): boolean {
	return /^[a-zA-Z0-9][-\w.,_]+@[\w.]+\.[\w]{2,}$/.test(email);
}