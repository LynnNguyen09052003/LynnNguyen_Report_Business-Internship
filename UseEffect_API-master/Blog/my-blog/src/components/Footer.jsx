function Footer() {
   return (
    <footer className="bg-orange-600 text-white py-4 px-2 sm:px-4 mt-8 border-t">
      <div className="container mx-auto text-center">
        <p className="text-sm sm:text-base lg:text-lg font-semibold">
          © {new Date().getFullYear()} My Blog - LE NGOC VINH.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
