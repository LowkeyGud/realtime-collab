import HeaderProfileBtn from "./HeaderProfileBtn";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import ThemeSelector from "./ThemeSelector";

console.log("Hello");

function Header() {
  return (
    <div className="relative z-10">
      <div
        className="flex items-center lg:justify-between justify-center 
        bg-background/80 backdrop-blur-xl p-6 mb-4 rounded-lg border border-border"
      >
        <div className="hidden lg:flex items-center gap-8">
          {/* Navigation */}
          <nav className="flex items-center space-x-1"></nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <ThemeSelector />
            <LanguageSelector hasAccess={true} />
          </div>

          <RunButton />

          <div className="pl-3 border-l border-border">
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Header;
