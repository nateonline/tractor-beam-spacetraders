import "./globals.css";

export const metadata = {
	title: "SpaceTraders UI",
	description: "Holographic SpaceTraders Dashboard",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
