'use client'
import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, Download, Plus, X } from "lucide-react";

// Add these type declarations near the top of the file (right after imports)
interface Education {
    school: string;
    degree: string;
    location: string;
    duration: string;
}
interface Experience {
    role: string;
    company: string;
    location: string;
    duration: string;
    points: string[];
}
interface Project {
    title: string;
    tech: string;
    duration: string;
    points: string[];
}
interface Skills {
    Languages: string;
    Frameworks: string;
    Tools: string;
    Libraries: string;
    [key: string]: string;
}
interface ResumeBase {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    education: Education[];
    experience: Experience[];
    projects: Project[];
    skills: Skills;
}
interface Resume extends ResumeBase {
    id: number;
    createdAt: string;
}
type Section = "education" | "experience" | "projects";

export default function Resume() {
    // Use typed state
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [previewMode, setPreviewMode] = useState<'saved' | 'draft'>('saved');

    // Structured form state (typed)
    const initialForm: ResumeBase = {
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        education: [{ school: "", degree: "", location: "", duration: "" }],
        experience: [{ role: "", company: "", location: "", duration: "", points: [""] }],
        projects: [{ title: "", tech: "", duration: "", points: [""] }],
        skills: {
            Languages: "",
            Frameworks: "",
            Tools: "",
            Libraries: "",
        },
    };
    const [form, setForm] = useState<ResumeBase>(initialForm);

    // Form validation state (partial allowed)
    const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'phone', string>>>({});

    // Properly typed ref for the preview div
    const resumeRef = useRef<HTMLDivElement | null>(null);

    // Load resumes from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("resumes");
        if (stored) setResumes(JSON.parse(stored));
    }, []);

    // Save to localStorage when resumes change
    useEffect(() => {
        if (resumes.length > 0) {
            localStorage.setItem("resumes", JSON.stringify(resumes));
        }
    }, [resumes]);

    // Validation functions (typed)
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone: string) => {
        const re = /^\+?[\d\s-]{10,}$/;
        return re.test(phone);
    };

    // Generic input handler with validation (typed event)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value } as any); // small assertion to allow dynamic key
        setErrors(prev => ({ ...prev, [name as 'name' | 'email' | 'phone']: "" }));
        if (name === "email" && value && !validateEmail(value)) {
            setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
        }
        if (name === "phone" && value && !validatePhone(value)) {
            setErrors(prev => ({ ...prev, phone: "Please enter a valid phone number" }));
        }
        setPreviewMode('draft');
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this resume?")) {
            const updated = resumes.filter((r) => r.id !== id);
            setResumes(updated);
            localStorage.setItem("resumes", JSON.stringify(updated));
            if (selectedResume?.id === id) setSelectedResume(null);
        }
    };

    // Handle nested field changes (education, experience, projects)
    const handleNestedChange = (section: Section, index: number, field: string, value: string) => {
        const updated = [...(form as any)[section]];
        updated[index] = { ...(updated[index] || {}), [field]: value };
        setForm({ ...form, [section]: updated } as any);
        setPreviewMode('draft');
    };

    // Handle points (array of bullet points)
    const handlePointChange = (section: Section, index: number, pointIndex: number, value: string) => {
        const updated = [...(form as any)[section]];
        updated[index].points[pointIndex] = value;
        setForm({ ...form, [section]: updated } as any);
        setPreviewMode('draft');
    };

    // Add new education/experience/project
    const addItem = (section: Section) => {
        const emptyItem =
            section === "education"
                ? { school: "", degree: "", location: "", duration: "" }
                : section === "experience"
                    ? { role: "", company: "", location: "", duration: "", points: [""] }
                    : { title: "", tech: "", duration: "", points: [""] };

        setForm({ ...form, [section]: [...(form as any)[section], emptyItem] } as any);
        setPreviewMode('draft');
    };

    // Remove item from a section
    const removeItem = (section: Section, index: number) => {
        if ((form as any)[section].length <= 1) {
            return; // Keep at least one item
        }
        const updated = [...(form as any)[section]];
        updated.splice(index, 1);
        setForm({ ...form, [section]: updated } as any);
        setPreviewMode('draft');
    };

    // Add new bullet point
    const addPoint = (section: Section, index: number) => {
        const updated = [...(form as any)[section]];
        updated[index].points.push("");
        setForm({ ...form, [section]: updated } as any);
        setPreviewMode('draft');
    };

    // Save resume with validation (typed event)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: Partial<Record<'name' | 'email' | 'phone', string>> = {};
        if (!form.name) newErrors.name = "Name is required";
        if (!form.email) newErrors.email = "Email is required";
        else if (!validateEmail(form.email)) newErrors.email = "Please enter a valid email address";
        if (!form.phone) newErrors.phone = "Phone number is required";
        else if (!validatePhone(form.phone)) newErrors.phone = "Please enter a valid phone number";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const newResume: Resume = {
                id: Date.now(),
                ...form,
                createdAt: new Date().toLocaleString(),
            };
            setResumes([newResume, ...resumes]);
            setSelectedResume(newResume);
            setPreviewMode('saved');

            setForm(initialForm);
            setErrors({});
        } catch (error) {
            console.error('Error saving resume:', error);
            alert('Failed to save resume. Please try again.');
        }
    };

    const handlePreview = (resume: Resume) => {
        setSelectedResume(resume);
        setPreviewMode('saved');
    };

    const handleDownload = async (resume: Resume) => {
        setIsGeneratingPDF(true);
        setSelectedResume(resume);
        await new Promise((r) => setTimeout(r, 300)); // wait for DOM update

        try {
            const input = resumeRef.current;
            if (!input) throw new Error('Resume preview not found');

            const canvas = await html2canvas(input, {
                scale: 2,
                logging: false,
                useCORS: true,
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = 210;
            const pdfHeight = 297;
            const imgProps = pdf.getImageProperties(imgData);
            const imgWidth = pdfWidth;
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            while (heightLeft > 0) {
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
                position -= pdfHeight;
                if (heightLeft > 0) pdf.addPage();
            }

            const fileName = `${resume.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_resume.pdf`;
            pdf.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGeneratingPDF(false);
        }
    };



    return (
        <div className="container mx-auto p-8 flex flex-col md:flex-row gap-8 bg-slate-50 min-h-screen">
            {/* LEFT SIDE */}
            <div className="md:w-1/3 bg-white shadow-xl rounded-3xl p-6 overflow-y-auto max-h-screen border border-slate-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Resumes</h2>

                {resumes.length === 0 ? (
                    <p className="text-gray-500">No resumes yet.</p>
                ) : (
                    <ul className="space-y-3 mb-4">
                        {resumes.map((r) => (
                            <li
                                key={r.id}
                                className={`p-3 rounded-xl border cursor-pointer ${selectedResume?.id === r.id ? "bg-blue-100" : "hover:bg-gray-50"
                                    }`}
                                onClick={() => handlePreview(r)}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold">{r.name}</h3>
                                        <p className="text-sm text-gray-500">{r.createdAt}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDownload(r);
                                            }}
                                            className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-900"
                                        >
                                            Download
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(r.id);
                                            }}
                                            className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-800"
                                        >
                                            Delete
                                        </button>
                                    </div>


                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* FORM */}
                <h3 className="text-xl font-bold mt-6 mb-2 text-gray-700">Create New Resume</h3>
                <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                    <div>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <input
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Phone"
                            className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : ''}`}
                            required
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <input
                        name="linkedin"
                        value={form.linkedin}
                        onChange={handleChange}
                        placeholder="LinkedIn URL"
                        className="w-full p-2 border rounded"
                    />
                    <input
                        name="github"
                        value={form.github}
                        onChange={handleChange}
                        placeholder="GitHub URL"
                        className="w-full p-2 border rounded"
                    />

                    {/* Education */}
                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold mb-2">Education</h4>
                        {form.education.map((edu, i) => (
                            <div key={i} className="border p-3 rounded-lg mb-3 bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-600">Education #{i + 1}</span>
                                    {form.education.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem("education", i)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <input
                                        placeholder="School"
                                        value={edu.school}
                                        onChange={(e) => handleNestedChange("education", i, "school", e.target.value)}
                                        className="w-full border p-2 rounded bg-white"
                                    />
                                    <input
                                        placeholder="Degree"
                                        value={edu.degree}
                                        onChange={(e) => handleNestedChange("education", i, "degree", e.target.value)}
                                        className="w-full border p-2 rounded bg-white"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            placeholder="Location"
                                            value={edu.location}
                                            onChange={(e) => handleNestedChange("education", i, "location", e.target.value)}
                                            className="w-full border p-2 rounded bg-white"
                                        />
                                        <input
                                            placeholder="Duration"
                                            value={edu.duration}
                                            onChange={(e) => handleNestedChange("education", i, "duration", e.target.value)}
                                            className="w-full border p-2 rounded bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addItem("education")}
                            className="w-full py-2 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            + Add Education
                        </button>
                    </div>

                    {/* Experience */}
                    <h4 className="font-semibold mt-4">Experience</h4>
                    {form.experience.map((exp, i) => (
                        <div key={i} className="border p-2 rounded space-y-1">
                            <input placeholder="Role" value={exp.role} onChange={(e) => handleNestedChange("experience", i, "role", e.target.value)} className="w-full border p-1 rounded" />
                            <input placeholder="Company" value={exp.company} onChange={(e) => handleNestedChange("experience", i, "company", e.target.value)} className="w-full border p-1 rounded" />
                            <input placeholder="Location" value={exp.location} onChange={(e) => handleNestedChange("experience", i, "location", e.target.value)} className="w-full border p-1 rounded" />
                            <input placeholder="Duration" value={exp.duration} onChange={(e) => handleNestedChange("experience", i, "duration", e.target.value)} className="w-full border p-1 rounded" />
                            {exp.points.map((p, j) => (
                                <input key={j} placeholder="Bullet point" value={p} onChange={(e) => handlePointChange("experience", i, j, e.target.value)} className="w-full border p-1 rounded" />
                            ))}
                            <button type="button" onClick={() => addPoint("experience", i)} className="text-blue-600 underline">
                                + Add Point
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addItem("experience")} className="text-blue-600 underline">
                        + Add Experience
                    </button>

                    {/* Projects */}
                    <h4 className="font-semibold mt-4">Projects</h4>
                    {form.projects.map((proj, i) => (
                        <div key={i} className="border p-2 rounded space-y-1">
                            <input placeholder="Title" value={proj.title} onChange={(e) => handleNestedChange("projects", i, "title", e.target.value)} className="w-full border p-1 rounded" />
                            <input placeholder="Tech Used" value={proj.tech} onChange={(e) => handleNestedChange("projects", i, "tech", e.target.value)} className="w-full border p-1 rounded" />
                            <input placeholder="Duration" value={proj.duration} onChange={(e) => handleNestedChange("projects", i, "duration", e.target.value)} className="w-full border p-1 rounded" />
                            {proj.points.map((p, j) => (
                                <input key={j} placeholder="Bullet point" value={p} onChange={(e) => handlePointChange("projects", i, j, e.target.value)} className="w-full border p-1 rounded" />
                            ))}
                            <button type="button" onClick={() => addPoint("projects", i)} className="text-blue-600 underline">
                                + Add Point
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addItem("projects")} className="text-blue-600 underline">
                        + Add Project
                    </button>

                    {/* Skills */}
                    <h4 className="font-semibold mt-4">Skills</h4>
                    {Object.keys(form.skills).map((key) => (
                        <input key={key} placeholder={key} value={form.skills[key]} onChange={(e) => setForm({ ...form, skills: { ...form.skills, [key]: e.target.value } })} className="w-full border p-1 rounded" />
                    ))}

                    <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold">
                        Save Resume
                    </button>
                </form>
            </div>

            {/* RIGHT SIDE PREVIEW */}
            <div className="md:w-2/3 bg-white shadow-xl rounded-3xl p-8 overflow-y-auto relative border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Preview
                        {previewMode === 'draft' && (
                            <span className="ml-2 text-sm text-blue-500 font-normal">(Draft)</span>
                        )}
                    </h2>
                </div>

                {isGeneratingPDF && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-2"></div>
                            <p className="text-gray-600">Generating PDF...</p>
                        </div>
                    </div>
                )}

                {(previewMode === 'saved' ? selectedResume : form) ? (
                    <div
                        ref={resumeRef}
                        style={{
                            width: "210mm",
                            minHeight: "297mm",
                            background: "#fff",
                            padding: "15mm",
                            fontFamily: "Georgia, serif",
                            color: "#000",
                        }}
                    >
                        <header style={{ textAlign: "center", marginBottom: "8mm" }}>
                            <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>{(previewMode === 'saved' ? selectedResume : form)?.name}</h1>
                            <p>{(previewMode === 'saved' ? selectedResume : form)?.email} | {(previewMode === 'saved' ? selectedResume : form)?.phone}</p>
                            <p>
                                <a href={(previewMode === 'saved' ? selectedResume : form)?.linkedin}>LinkedIn</a> |{" "}
                                <a href={(previewMode === 'saved' ? selectedResume : form)?.github}>GitHub</a>
                            </p>
                        </header>

                        {/* Education */}
                        <section style={{ marginBottom: "8mm" }}>
                            <h2
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    marginBottom: "2mm",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                Education
                            </h2>
                            <div style={{ height: "1px", backgroundColor: "#000", marginBottom: "3mm" }}></div>
                            {((previewMode === 'saved' ? selectedResume?.education : form.education) || []).map((edu, i) => (
                                <div key={i} style={{ marginTop: "3mm" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <strong>{edu.school}</strong>
                                        <span>{edu.location}</span>
                                    </div>
                                    <i>{edu.degree}</i>
                                    <div>{edu.duration}</div>
                                </div>
                            ))}
                        </section>

                        {/* Experience */}
                        <section style={{ marginBottom: "8mm" }}>
                            <h2
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    marginBottom: "2mm",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                Experience
                            </h2>
                            <div style={{ height: "1px", backgroundColor: "#000", marginBottom: "3mm" }}></div>
                            {((previewMode === 'saved' ? selectedResume?.experience : form.experience) || []).map((exp, i) => (
                                <div key={i} style={{ marginTop: "3mm" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <strong>{exp.role}</strong>
                                        <span>{exp.duration}</span>
                                    </div>
                                    <i>{exp.company}</i>, {exp.location}
                                    <ul style={{ marginLeft: "5mm", marginTop: "2mm" }}>
                                        {(Array.isArray(exp.points) ? exp.points : [])
                                            .filter(Boolean)
                                            .map((p, j) => (
                                                <li key={j}>{p}</li>
                                            ))}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        {/* Projects */}
                        <section style={{ marginBottom: "8mm" }}>
                            <h2
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    marginBottom: "2mm",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                Projects
                            </h2>
                            <div style={{ height: "1px", backgroundColor: "#000", marginBottom: "3mm" }}></div>
                            {((previewMode === 'saved' ? selectedResume?.projects : form.projects) || []).map((proj, i) => (
                                <div key={i} style={{ marginTop: "3mm" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <strong>{proj.title}</strong>
                                        <span>{proj.duration}</span>
                                    </div>
                                    <i>{proj.tech}</i>
                                    <ul style={{ marginLeft: "5mm", marginTop: "2mm" }}>
                                        {(Array.isArray(proj.points) ? proj.points : [])
                                            .filter(Boolean)
                                            .map((p, j) => (
                                                <li key={j}>{p}</li>
                                            ))}
                                    </ul>
                                </div>
                            ))}
                        </section>

                        {/* Skills */}
                        <section>
                            <h2
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "14px",
                                    marginBottom: "2mm",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                Technical Skills
                            </h2>
                            <div style={{ height: "1px", backgroundColor: "#000", marginBottom: "3mm" }}></div>
                            {Object.entries((previewMode === 'saved' ? selectedResume : form)?.skills || {}).map(
                                ([category, value], i) =>
                                    value && (
                                        <p key={i} style={{ marginBottom: "2mm" }}>
                                            <strong>{category}:</strong> {value}
                                        </p>
                                    )
                            )}
                        </section>

                    </div>
                ) : (
                    <p className="text-gray-500">Select a resume to preview.</p>
                )}
            </div>
        </div>
    );
}
