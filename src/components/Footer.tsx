const Footer = () => {
  return (
    <footer className="py-8 bg-foreground text-background border-t border-background/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
              <span className="text-foreground font-display text-sm italic">CH</span>
            </div>
            <span className="font-display font-semibold">Cristina Hernández</span>
          </div>
          
          <p className="text-background/60 text-sm">
            © {new Date().getFullYear()} — Built with care
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
