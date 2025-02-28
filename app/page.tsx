"use client";

import { useState, useEffect, useRef } from "react"
import { Github, Linkedin, Mail, Moon, Sun, X } from "lucide-react"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [portfolioVisible, setPortfolioVisible] = useState(false);
  const [theme, setTheme] = useState("light");
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const containerClass = "container mx-auto px-4 sm:px-6 md:px-12"; // Adjusted padding for smaller screens

  // Initialize theme based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["home", "about", "portfolio", "contact"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (current) {
        setActiveSection(current);
      }

      if (portfolioRef.current) {
        const rect = portfolioRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        setPortfolioVisible(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize skill bars animation
  useEffect(() => {
    const skillBars = document.querySelectorAll(".skill-progress");
    skillBars.forEach((bar) => {
      const width = bar.getAttribute("data-width") || "0%";
      setTimeout(() => {
        (bar as HTMLElement).style.width = width;
      }, 500);
    });
  }, []);

  // Filter portfolio projects
  const filterProjects = (category: string) => {
    setActiveFilter(category);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 60, // Adjusted for smaller screens
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  // Portfolio projects data
  const projects = [
    {
      id: 1,
      title: "E-commerce Website",
      category: "Web",
      description:
        "A fully functional e-commerce platform built with React and Node.js, featuring user authentication, product filtering, and secure payment integration.",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 2,
      title: "Mobile Banking App",
      category: "App",
      description:
        "A secure and user-friendly mobile banking application with real-time transaction tracking, budget management, and financial insights.",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      id: 3,
      title: "Travel Platform UI Design",
      category: "UI/UX",
      description:
        "A modern UI/UX design for a travel booking platform, focusing on user experience, accessibility, and conversion optimization.",
      image: "/placeholder.svg?height=300&width=400",
    },
  ];

  // Filter projects based on active category
  const filteredProjects =
    activeFilter === "all" ? projects : projects.filter((project) => project.category === activeFilter);

  const toggleProjectExpansion = (projectId: number) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const toggleProjectPopup = (project) => {
    setSelectedProject(selectedProject === project ? null : project);
  };

  useEffect(() => {
    if (selectedProject) {
      setIsOpen(true);
    } else {
      const timeout = setTimeout(() => setIsOpen(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [selectedProject]);

  return (
    <div className="transition-all duration-300 bg-transparent dark:bg-transparent text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="fixed w-full z-50 flex justify-between items-center transition-all duration-300 top-0 px-4 py-2 sm:top-6 sm:justify-center">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <nav className="hidden sm:flex items-center rounded-full dark:backdrop-blur-lg dark:bg-gray-900/60 backdrop-blur-lg bg-white/60 px-2 py-2 transition-all duration-300 shadow-md">
            <div className="flex items-center space-x-4 sm:space-x-6">
              {["home", "about", "portfolio", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`relative font-medium px-2 py-1 sm:px-4 sm:py-1.5 cursor-pointer rounded-full text-sm sm:text-base ${activeSection === item
                    ? "text-white bg-primary"
                    : "text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                    } transition-colors duration-300`}
                >
                  <span className="capitalize">{item}</span>
                </button>
              ))}
            </div>
          </nav>
          <button
            onClick={toggleTheme}
            className="rounded-full p-3 sm:mt-0 mt-2 sm:p-2 dark:backdrop-blur-lg dark:bg-gray-900/40 backdrop-blur-lg bg-white/60 text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-all duration-300 shadow-md"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
        <button
          className="sm:hidden text-gray-700 dark:text-gray-300"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } sm:hidden`}
        onClick={toggleMobileMenu}
      />
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } sm:hidden`}
        onClick={toggleMobileMenu}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-xs relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-4 right-4 text-gray-700 dark:text-gray-300"
            onClick={toggleMobileMenu}
          >
            <X size={24} />
          </button>
          <div className="flex flex-col gap-4">
            {["home", "about", "portfolio", "contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`text-lg font-medium transition-colors hover:text-primary ${activeSection === item ? "text-primary" : "text-gray-700 dark:text-gray-300"
                  }`}
              >
                <span className="capitalize">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Home Section */}
      <section id="home" className="min-h-[calc(100vh-4rem)] flex items-center pt-16 bg-white dark:bg-gray-900 transition-all duration-300">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-500/20 to-primary/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        <div className={`${containerClass}`}>
          <div className="flex flex-col gap-8 items-center sm:grid sm:grid-cols-2 sm:gap-12 sm:items-center">
            <div className="flex justify-center">
              <div
                className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full overflow-hidden animate-fadeIn opacity-0"
                style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-full blur-xl opacity-70"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl bg-transparent dark:bg-transparent">
                  <img
                    src="https://avatars.githubusercontent.com/u/94650452?v=4"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 text-center sm:text-left animate-fadeIn opacity-0 cursor-default">
              <h1 className="text-3xl sm:text-4xl text-gray-800 dark:text-gray-200 md:text-5xl lg:text-6xl font-bold  dark:text-white">
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                  Tino
                </span>
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl text-primary font-medium">Web Developer & Designer</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto sm:mx-0">
                I create beautiful, functional websites and applications that help businesses grow and succeed online.
              </p>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start ">
                <button
                  onClick={() => scrollToSection("portfolio")}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-primary cursor-pointer to-indigo-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
                >
                  View My Work
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="px-4 py-2 sm:px-6 sm:py-3 border-2 border-primary/50 text-primary/70 cursor-pointer dark:text-primary/70 rounded-full font-medium hover:bg-primary/5 transition-all duration-300 hover:shadow-[0_0_10px_2px_rgba(80, 139, 210, 1)] hover:shadow-blue-400 hover:text-blue-600/90 dark:hover:text-blue-400 hover:bg-primary/20 dark:hover:border-blue-400/80 hover:border-blue-500/90 hover:drop-shadow-[0_0_8px_rgba(59,130,246,1)]"
                >
                  Contact Me
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-10 sm:py-14 bg-white dark:bg-gray-900 transition-all duration-300">
        <div className={`${containerClass}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mt-12 sm:mt-10 relative inline-block mx-auto text-gray-900 dark:text-white cursor-default">
            About Me
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-pink-500 rounded-full transform translate-y-2"></span>
          </h2>

          <div className="flex flex-col gap-6 md:flex-row md:gap-8 md:justify-center transition-all duration-300 md:items-start">
            <div className="md:w-1/2 space-y-3 flex flex-col pt-16">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base cursor-default">
                Hello! I'm a passionate web developer and designer with over 5 years of experience creating digital
                experiences that users love. I specialize in building responsive websites and applications that are both visually appealing and highly functional.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base cursor-default">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects,
                or enjoying outdoor activities like hiking and photography.
              </p>
            </div>

            <div className="md:w-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3 sm:p-4 border border-gray-100 dark:border-gray-700 cursor-default flex flex-col mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">My Skills</h3>
              <div className="space-y-3">
                {["HTML/CSS", "JavaScript", "React", "UI/UX Design"].map((skill, index) => (
                  <div key={skill}>
                    <div className="flex justify-between mb-1 text-gray-900 dark:text-white text-sm">
                      <span className="font-medium">{skill}</span>
                      <span>{90 - index * 5}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-indigo-600 rounded-full"
                        style={{ width: `${90 - index * 5}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 sm:py-20 dark:bg-gray-900 cursor-default transition-all duration-300" ref={portfolioRef}>
        <div className={`${containerClass}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-10 relative inline-block mx-auto text-gray-900 dark:text-white">
            My Portfolio
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-pink-500 rounded-full transform translate-y-2"></span>
          </h2>

          <div className="flex justify-center flex-wrap  gap-2 sm:gap-4 mb-8 sm:mb-12">
            {["all", "Web", "App", "UI/UX"].map((category) => (
              <button
                key={category}
                onClick={() => filterProjects(category)}
                className={`px-3 py-1  sm:px-5 sm:py-2 rounded-full text-sm sm:text-base transition-all cursor-pointer duration-300 ${activeFilter === category
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                <span className="capitalize">{category}</span>
              </button>
            ))}
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 transition-all duration-300 ${portfolioVisible ? "opacity-100" : "opacity-0"
              }`}
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
              >
                <div
                  className="relative h-40 sm:h-48 overflow-hidden cursor-pointer"
                  onClick={() => toggleProjectPopup(project)}
                >
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute inset-0  opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium text-sm sm:text-base">View Details</span>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="text-xs sm:text-sm text-primary font-medium mb-2 capitalize">{project.category} Development</div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 dark:text-white">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4">
                    {project.description.slice(0, 80)}...
                  </p>
                  <button
                    className="text-primary font-medium hover:underline inline-flex items-center text-sm sm:text-base mt-2 cursor-pointer"
                    onClick={() => toggleProjectPopup(project)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-all duration-300"
      >
        <div className={`${containerClass}`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 relative inline-block mx-auto text-gray-900 dark:text-white cursor-default">
            Contact Me
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-pink-500 rounded-full transform translate-y-2"></span>
          </h2>

          <div className="flex flex-col gap-6 md:grid md:grid-cols-2 rouded-xl md:gap-8">
            {/* Modern "Get in Touch" Card */}
            <div className="relative bg-gradient-to-br from-primary to-indigo-600 rounded-xl p-6 text-white overflow-hidden group">
              {/* Gradient Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-indigo-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* Glassmorphism Effect */}
              <div className="absolute inset-0 backdrop-blur-sm bg-white/10 rounded-xl"></div>

              <h3 className="cursor-default text-xl sm:text-2xl font-semibold mb-6 text-center relative z-10">
                Get In Touch
              </h3>
              <div className="space-y-4 relative z-10">
                {[
                  { icon: Mail, label: "Email", value: "your.email@example.com" },
                  { icon: Linkedin, label: "LinkedIn", value: "linkedin.com/in/yourprofile" },
                  { icon: Github, label: "GitHub", value: "github.com/yourusername" },
                ].map(({ icon: Icon, label, value }) => (
                  <a
                    key={label}
                    href={`https://${value}`}
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg">
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium opacity-80">{label}</div>
                      <div className="text-sm font-semibold">{value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <form className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-primary to-indigo-600 cursor-pointer text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 transition-all duration-300">
        <div className={`${containerClass}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="text-xl sm:text-2xl font-bold mb-4 cursor-default">
                Valentino
                <span className="bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                  Ivanovski
                </span>
              </div>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base cursor-default">
                Creating beautiful digital experiences that help businesses grow and succeed online.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Github size={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Mail size={16} />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <button
                    onClick={() => scrollToSection("home")}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("portfolio")}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Portfolio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contact")}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer  "
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Services</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li>
                  <a href="#" className="text-gray-400 cursor-default  ">
                    Web Development
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 cursor-default ">
                    UI/UX Design
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 cursor-default">
                    Mobile Development
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 cursor-default">
                    Branding
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Popup */}
      <div
        className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } ${!selectedProject ? "hidden" : ""}`}
        onClick={() => toggleProjectPopup(null)}
      >
        <div
          className={`bg-white dark:bg-gray-800 p-6 rounded-xl max-w-2xl w-full m-4 transform transition-all duration-500 ease-in-out ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {selectedProject && (
            <>
              <h3 className="text-2xl font-semibold mb-4 dark:text-white">{selectedProject.title}</h3>
              <img
                src={selectedProject.image || "/placeholder.svg"}
                alt={selectedProject.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedProject.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["React", "Node.js", "MongoDB", "Express"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a href="#" className="text-primary hover:underline">
                  Live Demo
                </a>
                <a href="#" className="text-primary hover:underline">
                  Source Code
                </a>
              </div>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => toggleProjectPopup(null)}
              >
                <X size={24} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}