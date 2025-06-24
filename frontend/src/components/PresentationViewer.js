import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaPlus, FaShareAlt, FaPlay, FaEllipsisH, FaPalette } from 'react-icons/fa';
import ContextMenu from './ContextMenu';
import GradientPicker from './GradientPicker';
import OverlaySVG from './OverlaySVG';
import OverlaySettingsModal from './OverlaySettingsModal';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const gradients = [
  'bg-gradient-to-br from-[#a86e6e] via-[#c9a06a] to-[#18151c]',
  'bg-gradient-to-br from-[#6ea8a8] via-[#6ac9b7] to-[#1c1821]',
  'bg-gradient-to-br from-[#6e7aa8] via-[#6a8fc9] to-[#1c1d21]',
  'bg-gradient-to-br from-[#a86ea0] via-[#c96ab7] to-[#211c1e]',
  'bg-gradient-to-br from-[#a8a76e] via-[#c9c76a] to-[#21211c]',
  'bg-gradient-to-br from-[#6ea87a] via-[#6ac97a] to-[#1c211c]',
  'bg-gradient-to-br from-[#a86e7a] via-[#c96a8f] to-[#211c1d]',
  'bg-gradient-to-br from-[#6e8fa8] via-[#6ab7c9] to-[#1c2121]',
];

function getRandomGradient() {
  return gradients[Math.floor(Math.random() * gradients.length)];
}

// Helper to render a block
function renderBlock(block, i, slideIdx, handleBlockEdit) {
  switch (block.type) {
    case 'heading':
      return (
        <h2
          key={i}
          className="text-white text-3xl md:text-4xl font-bold mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleBlockEdit(slideIdx, i, e.target.innerText)}
        >
          {block.content}
        </h2>
      );
    case 'paragraph':
      return (
        <p
          key={i}
          className="text-gray-200 text-lg mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleBlockEdit(slideIdx, i, e.target.innerText)}
        >
          {block.content}
        </p>
      );
    case 'callout':
      return (
        <div
          key={i}
          className="bg-blue-900/40 border-l-4 border-blue-400 text-blue-100 p-4 rounded mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleBlockEdit(slideIdx, i, e.target.innerText)}
        >
          {block.content}
        </div>
      );
    case 'textCard':
      return (
        <div
          key={i}
          className="bg-black/40 rounded-xl p-6 text-white shadow mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleBlockEdit(slideIdx, i, e.target.innerText)}
        >
          {block.content}
        </div>
      );
    case 'numberCard':
      return (
        <div
          key={i}
          className="bg-black/40 rounded-xl p-6 text-white shadow mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleBlockEdit(slideIdx, i, e.target.innerText)}
        >
          Number: {block.content}
        </div>
      );
    case 'iconCard':
      return (
        <div
          key={i}
          className="bg-black/40 rounded-xl p-6 text-white shadow mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleBlockEdit(slideIdx, i, e.target.innerText)}
        >
          🧩 {block.content}
        </div>
      );
    case 'image':
      return <img key={i} src={block.url || ''} alt={block.content} className="rounded-xl w-full max-w-md mx-auto mb-6" />;
    case 'embed':
      return (
        <div
          key={i}
          className="bg-black/40 rounded-xl p-6 text-white shadow mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleBlockEdit(slideIdx, i, e.target.innerText)}
        >
          Embed: {block.content}
        </div>
      );
    case 'mockup':
      return (
        <div
          key={i}
          className="bg-black/40 rounded-xl p-6 text-white shadow mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleBlockEdit(slideIdx, i, e.target.innerText)}
        >
          Mockup: {block.content}
        </div>
      );
    case 'quote':
      return (
        <blockquote
          key={i}
          className="border-l-4 border-gray-400 pl-4 italic text-gray-300 mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleBlockEdit(slideIdx, i, e.target.innerText)}
        >
          {block.content}
        </blockquote>
      );
    case 'sticky':
      return (
        <div
          key={i}
          className="bg-yellow-200 text-black rounded p-4 shadow mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleBlockEdit(slideIdx, i, e.target.innerText)}
        >
          {block.content}
        </div>
      );
    default:
      return (
        <div
          key={i}
          className="text-gray-400 mb-4"
          contentEditable
          suppressContentEditableWarning
          onBlur={e => handleBlockEdit(slideIdx, i, e.target.innerText)}
        >
          {block.type}: {block.content}
        </div>
      );
  }
}

const PresentationViewer = () => {
  const { id } = useParams();
  const [presentation, setPresentation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [slideGradients, setSlideGradients] = useState([]);
  const slideRefs = useRef([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const insertButtonRef = useRef(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggingBlock, setDraggingBlock] = useState({ slideIdx: null, blockIdx: null });
  const [isPresenting, setIsPresenting] = useState(false);
  const [presentSlideIdx, setPresentSlideIdx] = useState(0);
  const presentContainerRef = useRef(null);
  const [showGradientPicker, setShowGradientPicker] = useState(false);
  const [gradientPickerTargetIdx, setGradientPickerTargetIdx] = useState(null);
  const [showOverlaySettings, setShowOverlaySettings] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [isEditingSlideTitle, setIsEditingSlideTitle] = useState(false);
  const [editedSlideTitle, setEditedSlideTitle] = useState("");

  useEffect(() => {
    const fetchPresentation = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/presentations/${id}`, {
          headers: {
            'auth-token': localStorage.getItem('token')
          }
        });
        setPresentation(response.data);
      } catch (error) {
        setPresentation(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPresentation();
  }, [id]);

  // Assign random gradients to slides on presentation load
  useEffect(() => {
    if (
      presentation &&
      presentation.slides &&
      slideGradients.length !== presentation.slides.length
    ) {
      setSlideGradients(
        Array.from({ length: presentation.slides.length }, () => getRandomGradient())
      );
    }
    // eslint-disable-next-line
  }, [presentation]);

  // Center-of-viewport logic for current chapter
  useEffect(() => {
    if (!presentation || !presentation.slides) return;
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let minDist = Infinity;
      let closestIdx = 0;
      slideRefs.current.forEach((ref, idx) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const slideCenter = rect.top + rect.height / 2;
          const dist = Math.abs(slideCenter - viewportCenter);
          if (dist < minDist) {
            minDist = dist;
            closestIdx = idx;
          }
        }
      });
      setCurrentChapter(closestIdx + 1);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [presentation]);

  const handleAddSlide = (index) => {
    // Placeholder for add slide logic
    alert(`Add slide at position ${index + 1}`);
  };

  // Insert block/widget into current slide
  const handleInsertBlock = (type) => {
    setPresentation(prev => {
      const slides = [...prev.slides];
      const idx = currentChapter - 1;
      const slide = { ...slides[idx] };
      if (!slide.blocks) slide.blocks = [];
      slide.blocks.push({ type, content: `New ${type}`, x: 100, y: 100 });
      slides[idx] = slide;
      return { ...prev, slides };
    });
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  // Add this effect to close menu on outside click
  useEffect(() => {
    if (!contextMenu.visible) return;
    const handleClick = (e) => {
      if (
        insertButtonRef.current &&
        !insertButtonRef.current.contains(e.target)
      ) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [contextMenu.visible]);

  const savePresentation = async (updatedPresentation) => {
    try {
      await axios.put(
        `http://localhost:5001/api/presentations/${id}`,
        updatedPresentation,
        { headers: { 'auth-token': localStorage.getItem('token') } }
      );
      // Optionally show a "Saved" toast or indicator here
    } catch (error) {
      // Optionally show an error toast here
      console.error('Failed to save presentation:', error);
    }
  };

  const handleSlideContentEdit = (slideIdx, field, value) => {
    setPresentation(prev => {
      const slides = [...prev.slides];
      slides[slideIdx] = { ...slides[slideIdx], [field]: value };
      const updated = { ...prev, slides };
      savePresentation(updated);
      return updated;
    });
  };

  const handleBlockEdit = (slideIdx, blockIdx, value) => {
    setPresentation(prev => {
      const slides = [...prev.slides];
      const blocks = [...slides[slideIdx].blocks];
      blocks[blockIdx] = { ...blocks[blockIdx], content: value };
      slides[slideIdx] = { ...slides[slideIdx], blocks };
      const updated = { ...prev, slides };
      savePresentation(updated);
      return updated;
    });
  };

  const handleBlockDragStart = (e, slideIdx, blockIdx) => {
    const block = presentation.slides[slideIdx].blocks[blockIdx];
    setDraggingBlock({ slideIdx, blockIdx });
    setDragOffset({
      x: e.clientX - (block.x || 100),
      y: e.clientY - (block.y || 100),
    });
  };

  const handleBlockDrag = (e, slideIdx, blockIdx) => {
    if (e.clientX === 0 && e.clientY === 0) return; // Ignore dragend event
    setPresentation(prev => {
      const slides = [...prev.slides];
      const blocks = [...slides[slideIdx].blocks];
      blocks[blockIdx] = {
        ...blocks[blockIdx],
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      };
      slides[slideIdx] = { ...slides[slideIdx], blocks };
      return { ...prev, slides };
    });
  };

  const handleBlockDragEnd = (e, slideIdx, blockIdx) => {
    setDraggingBlock({ slideIdx: null, blockIdx: null });
    savePresentation(presentation);
  };

  // Keyboard navigation for present mode
  useEffect(() => {
    if (!isPresenting) return;
    const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
        setPresentSlideIdx(idx => Math.min(presentation.slides.length - 1, idx + 1));
    } else if (e.key === 'ArrowLeft') {
        setPresentSlideIdx(idx => Math.max(0, idx - 1));
      } else if (e.key === 'Escape') {
        setIsPresenting(false);
    }
  };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresenting, presentation]);

  useEffect(() => {
    if (isPresenting && presentContainerRef.current) {
      if (presentContainerRef.current.requestFullscreen) {
        presentContainerRef.current.requestFullscreen();
      } else if (presentContainerRef.current.webkitRequestFullscreen) {
        presentContainerRef.current.webkitRequestFullscreen();
      } else if (presentContainerRef.current.mozRequestFullScreen) {
        presentContainerRef.current.mozRequestFullScreen();
      } else if (presentContainerRef.current.msRequestFullscreen) {
        presentContainerRef.current.msRequestFullscreen();
      }
    }
    if (!isPresenting && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [isPresenting]);

  const handleSetSlideGradient = (slideIdx, gradient) => {
    setPresentation(prev => {
      const slides = [...prev.slides];
      slides[slideIdx] = { ...slides[slideIdx], customGradient: gradient };
      const updated = { ...prev, slides };
      savePresentation(updated);
      return updated;
    });
  };

  const handleSetSlideOverlay = (slideIdx, overlayId) => {
    setPresentation(prev => {
      const slides = [...prev.slides];
      slides[slideIdx] = { ...slides[slideIdx], customOverlay: overlayId };
      const updated = { ...prev, slides };
      savePresentation(updated);
      return updated;
    });
  };

  const handleSetOverlaySettings = (slideIdx, settings) => {
    setPresentation(prev => {
      const slides = [...prev.slides];
      slides[slideIdx] = { ...slides[slideIdx], customOverlaySettings: settings };
      const updated = { ...prev, slides };
      savePresentation(updated);
      return updated;
    });
  };

  // Handle click outside export menu to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    }
    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportMenu]);

  // PPTX Export logic
  const handleExportPPTX = () => {
    const pptx = new window.PptxGenJS();
    presentation.slides.forEach(slide => {
      const slideObj = pptx.addSlide();
      slideObj.addText(slide.title || '', { x: 0.5, y: 0.5, fontSize: 24, bold: true });
      if (slide.subtitle) {
        slideObj.addText(slide.subtitle, { x: 0.5, y: 1.2, fontSize: 18, color: '666666' });
      }
      if (slide.content) {
        slideObj.addText(slide.content, { x: 0.5, y: 2, fontSize: 16 });
      }
    });
    pptx.writeFile(`${presentation.title || 'presentation'}.pptx`);
    setShowExportMenu(false);
  };

  // PDF Export logic
  const handleExportPDF = async () => {
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });
    for (let i = 0; i < presentation.slides.length; i++) {
      const slideRef = slideRefs.current[i];
      if (slideRef) {
        const canvas = await html2canvas(slideRef, { backgroundColor: null });
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
        if (i < presentation.slides.length - 1) pdf.addPage();
      }
    }
    pdf.save(`${presentation.title || 'presentation'}.pdf`);
    setShowExportMenu(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1c1f2e] flex items-center justify-center">
        <div className="text-white text-xl">Loading presentation...</div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="min-h-screen bg-[#1c1f2e] flex items-center justify-center">
        <div className="text-white text-xl">Presentation not found</div>
      </div>
    );
  }

  const totalSlides = presentation.slides.length;

  if (isPresenting) {
    const slide = presentation.slides[presentSlideIdx];
  return (
      <div ref={presentContainerRef} className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className={`w-full h-full flex items-center justify-center ${slide.customGradient || slideGradients[presentSlideIdx] || gradients[0]}`}>
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            {slide.customOverlay && (
              <div className="absolute inset-0 w-full h-full flex justify-end pointer-events-none z-0">
                <OverlaySVG
                  id={slide.customOverlay}
                  size={slide.customOverlaySettings?.size || 1}
                  color={slide.customOverlaySettings?.color || '#fff'}
                  opacity={slide.customOverlaySettings?.opacity || 0.15}
                  position={slide.customOverlaySettings?.position || 'center'}
                  className="w-full h-full"
                />
              </div>
            )}
            <h2 className="text-white text-5xl font-semibold text-center mb-6">{slide.title}</h2>
            {slide.subtitle && (
              <p className="text-gray-200 text-2xl mb-8 text-center max-w-2xl">{slide.subtitle}</p>
            )}
            {slide.content && slide.content.split('\n').length > 1 && (
              <ul className="mt-2 space-y-4 text-white text-2xl w-full max-w-2xl mx-auto">
                {slide.content.split('\n').map((point, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-3 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
            {slide.content && slide.content.split('\n').length === 1 && !slide.subtitle && (
              <p className="text-gray-200 text-2xl mt-4 text-center max-w-2xl">{slide.content}</p>
            )}
            {slide.image && (
              <img
                src={slide.image}
                alt={slide.title}
                className="rounded-xl w-full max-w-md mx-auto mb-6"
              />
            )}
            {slide.blocks && (
              <div className="relative w-full h-full">
                {slide.blocks.map((block, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: block.x || 100,
                      top: block.y || 100,
                      zIndex: 10,
                    }}
                  >
                    {renderBlock(block, i, presentSlideIdx, () => {})}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Navigation arrows */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/40 rounded-full px-4 py-2"
          onClick={() => setPresentSlideIdx(idx => Math.max(0, idx - 1))}
          disabled={presentSlideIdx === 0}
        >&#8592;</button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl bg-black/40 rounded-full px-4 py-2"
          onClick={() => setPresentSlideIdx(idx => Math.min(presentation.slides.length - 1, idx + 1))}
          disabled={presentSlideIdx === presentation.slides.length - 1}
        >&#8594;</button>
        {/* Exit button */}
        <button
          className="absolute top-6 right-6 text-white text-xl bg-black/60 px-4 py-2 rounded"
          onClick={() => setIsPresenting(false)}
        >Exit</button>
      </div>
    );
  }

  return (
    <div
      className="w-screen min-h-screen bg-[#18151c] pb-32"
      onContextMenu={e => {
        if (e.shiftKey) {
          e.preventDefault();
          setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
        }
        // Otherwise, allow default right-click menu
      }}
    >
      {/* Floating Top Bar */}
      <div className="fixed top-6 left-0 w-full flex justify-between items-center px-8 z-50 pointer-events-none">
        <div className="flex items-center pointer-events-auto">
          <div className="bg-[#18151c]/90 text-white rounded-xl px-4 py-2 shadow-lg flex items-center space-x-2 text-base font-medium">
            {isEditingTitle ? (
              <input
                className="bg-transparent border-b border-gray-400 text-white outline-none w-64 mr-2"
                value={editedTitle}
                autoFocus
                onChange={e => setEditedTitle(e.target.value)}
                onBlur={() => {
                  setIsEditingTitle(false);
                  if (editedTitle.trim() && editedTitle !== presentation.title) {
                    const updated = { ...presentation, title: editedTitle };
                    setPresentation(updated);
                    savePresentation(updated);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.target.blur();
                  }
                }}
              />
            ) : (
              <span
                style={{ cursor: "pointer", borderBottom: "1px dashed #aaa" }}
                onClick={() => {
                  setEditedTitle(presentation.title);
                  setIsEditingTitle(true);
                }}
              >
                {presentation.title}
              </span>
            )}
            <span className="mx-2 text-gray-400">/</span>
            {isEditingSlideTitle ? (
              <input
                className="bg-transparent border-b border-gray-400 text-white outline-none w-64"
                value={editedSlideTitle}
                autoFocus
                onChange={e => setEditedSlideTitle(e.target.value)}
                onBlur={() => {
                  setIsEditingSlideTitle(false);
                  const idx = currentChapter - 1;
                  if (
                    editedSlideTitle.trim() &&
                    editedSlideTitle !== presentation.slides[idx].title
                  ) {
                    handleSlideContentEdit(idx, "title", editedSlideTitle);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.target.blur();
                  }
                }}
              />
            ) : (
              <span
                style={{ cursor: "pointer", borderBottom: "1px dashed #aaa" }}
                onClick={() => {
                  const idx = currentChapter - 1;
                  setEditedSlideTitle(presentation.slides[idx].title || "");
                  setIsEditingSlideTitle(true);
                }}
              >
                {presentation.slides[currentChapter - 1]?.title || `Slide ${currentChapter}`}
              </span>
            )}
            <span className="mx-2 text-gray-400">/</span>
            <span>Slide {currentChapter} of {totalSlides}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 pointer-events-auto">
          <button className="bg-[#18151c]/90 text-white rounded-xl px-4 py-2 shadow-lg flex items-center space-x-2 hover:bg-[#23232b] transition">
            <FaShareAlt />
            <span>Share</span>
          </button>
          <button className="bg-[#18151c]/90 text-white rounded-xl px-4 py-2 shadow-lg flex items-center space-x-2 hover:bg-[#23232b] transition"
            onClick={() => {
              setIsPresenting(true);
              setPresentSlideIdx(currentChapter - 1);
            }}
          >
            <FaPlay />
            <span>Present</span>
          </button>
          {/* Export Button */}
          <div className="relative" ref={exportMenuRef}>
            <button
              className="bg-[#18151c]/90 text-white rounded-xl px-4 py-2 shadow-lg flex items-center space-x-2 hover:bg-[#23232b] transition"
              onClick={() => setShowExportMenu(v => !v)}
            >
              <span role="img" aria-label="export">⬇️</span>
              <span>Export</span>
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#23232b] border border-[#333] rounded-xl shadow-xl z-50">
                {/*
                <button
                  className="w-full text-left px-4 py-3 text-white hover:bg-[#353545] transition-colors rounded-t-xl"
                  onClick={handleExportPPTX}
                >
                  Export as PPTX
                </button>
                */}
                <button
                  className="w-full text-left px-4 py-3 text-white hover:bg-[#353545] transition-colors rounded-b-xl"
                  onClick={handleExportPDF}
                >
                  Export as PDF
                </button>
              </div>
            )}
          </div>
          <button className="bg-[#18151c]/90 text-white rounded-xl p-2 shadow-lg flex items-center hover:bg-[#23232b] transition">
            <FaEllipsisH />
          </button>
        </div>
      </div>

      {/* Floating Toolbar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 bg-[#18151c]/90 rounded-xl shadow-lg px-4 py-2 border border-[#23232b]">
        <button
          ref={insertButtonRef}
          className="flex items-center space-x-2 text-white font-medium px-3 py-1 rounded hover:bg-[#23232b] transition"
          onClick={e => {
            e.preventDefault();
            const buttonRect = insertButtonRef.current.getBoundingClientRect();
            setContextMenu({
              visible: true,
              x: buttonRect.left + buttonRect.width / 2 - 110, // 110 = half menu width
              y: buttonRect.top - 220 // 220 = menu height (shows above the button)
            });
          }}
        >
          <FaPlus />
          <span>Insert</span>
        </button>
        <button
          className="flex items-center space-x-2 text-white font-medium px-3 py-1 rounded hover:bg-[#23232b] transition"
          onClick={() => {
            setGradientPickerTargetIdx(null);
            setShowGradientPicker(true);
          }}
        >
          <FaPalette />
          <span>Background</span>
        </button>
        {/* ... other toolbar buttons can go here ... */}
      </div>

      {/* ContextMenu for Insert button or Shift+RightClick */}
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onSelect={type => {
            handleInsertBlock(type);
            setContextMenu({ ...contextMenu, visible: false });
          }}
          onClose={() => setContextMenu({ ...contextMenu, visible: false })}
        />
      )}

      {showGradientPicker && (
        <GradientPicker
          onSelect={gradient => {
            const idx = gradientPickerTargetIdx === null ? currentChapter - 1 : gradientPickerTargetIdx;
            handleSetSlideGradient(idx, gradient);
            setShowGradientPicker(false);
          }}
          onSelectOverlay={overlayId => {
            const idx = gradientPickerTargetIdx === null ? currentChapter - 1 : gradientPickerTargetIdx;
            handleSetSlideOverlay(idx, overlayId);
            setShowGradientPicker(false);
            setShowOverlaySettings(true);
          }}
          onClose={() => setShowGradientPicker(false)}
        />
      )}

      {showOverlaySettings && (
        <OverlaySettingsModal
          settings={presentation.slides[(gradientPickerTargetIdx === null ? currentChapter - 1 : gradientPickerTargetIdx)]?.customOverlaySettings || {}}
          onSave={settings => {
            const idx = gradientPickerTargetIdx === null ? currentChapter - 1 : gradientPickerTargetIdx;
            handleSetOverlaySettings(idx, settings);
            setShowOverlaySettings(false);
          }}
          onClose={() => setShowOverlaySettings(false)}
        />
      )}

      {/* Slides */}
      {presentation.slides.length > 0 && (
        <section
          ref={el => slideRefs.current[0] = el}
          className={`w-screen h-screen flex items-center justify-center ${presentation.slides[0].customGradient || slideGradients[0] || gradients[0]}`}
        >
          <div className="relative w-full h-full">
            {presentation.slides[0].customOverlay && (
              <div className="absolute inset-0 w-full h-full flex justify-end pointer-events-none z-0">
                <OverlaySVG
                  id={presentation.slides[0].customOverlay}
                  size={presentation.slides[0].customOverlaySettings?.size || 1}
                  color={presentation.slides[0].customOverlaySettings?.color || '#fff'}
                  opacity={presentation.slides[0].customOverlaySettings?.opacity || 0.15}
                  position={presentation.slides[0].customOverlaySettings?.position || 'center'}
                  className="w-full h-full"
                />
              </div>
            )}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
              <h2
                className="text-white text-4xl md:text-5xl font-semibold text-center mb-6"
                contentEditable
                suppressContentEditableWarning
                onBlur={e => handleSlideContentEdit(0, 'title', e.target.innerText)}
              >
                {presentation.slides[0].title}
              </h2>
              {presentation.slides[0].subtitle && (
                <p
                  className="text-gray-200 text-xl mb-8 text-center max-w-2xl"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => handleSlideContentEdit(0, 'subtitle', e.target.innerText)}
                >
                  {presentation.slides[0].subtitle}
                </p>
              )}
              {presentation.slides[0].content && presentation.slides[0].content.split('\n').length > 1 && (
                <ul className="mt-2 space-y-4 text-white text-lg w-full max-w-2xl mx-auto">
                  {presentation.slides[0].content.split('\n').map((point, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-3 mt-1">•</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={e => {
                          const updated = [...presentation.slides[0].content.split('\n')];
                          updated[i] = e.target.innerText;
                          handleSlideContentEdit(0, 'content', updated.join('\n'));
                        }}
                      >
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {presentation.slides[0].content && presentation.slides[0].content.split('\n').length === 1 && !presentation.slides[0].subtitle && (
                <p
                  className="text-gray-200 text-xl mt-4 text-center max-w-2xl"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => handleSlideContentEdit(0, 'content', e.target.innerText)}
                >
                  {presentation.slides[0].content}
                </p>
              )}
              {/* Slide image if present */}
              {presentation.slides[0].image && (
                <img
                  src={presentation.slides[0].image}
                  alt={presentation.slides[0].title}
                  className="rounded-xl w-full max-w-md mx-auto mb-6"
                />
              )}
              {/* Slide blocks if present */}
              {presentation.slides[0].blocks && (
                <div className="relative w-full h-full">
                  {presentation.slides[0].blocks.map((block, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: block.x || 100,
                        top: block.y || 100,
                        cursor: 'move',
                        zIndex: 10,
                      }}
                      draggable
                      onDragStart={e => handleBlockDragStart(e, 0, i)}
                      onDrag={e => handleBlockDrag(e, 0, i)}
                      onDragEnd={e => handleBlockDragEnd(e, 0, i)}
                    >
                      {renderBlock(block, i, 0, handleBlockEdit)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      {/* Other slides as large cards */}
      <div className="flex flex-col items-center w-full">
        {presentation.slides.slice(1).map((slide, idx) => (
          <React.Fragment key={idx}>
            {/* + button between slides */}
            <button
              className="my-12 flex items-center justify-center w-12 h-12 rounded-full bg-[#23232b] hover:bg-[#353545] text-white shadow-lg border-2 border-[#23232b] focus:outline-none"
              style={{ zIndex: 10 }}
              onClick={() => handleAddSlide(idx + 1)}
              aria-label="Add slide"
            >
              <FaPlus />
            </button>
            <section ref={el => slideRefs.current[idx + 1] = el} className={`${slide.customGradient || slideGradients[idx + 1] || gradients[(idx + 1) % gradients.length]} rounded-2xl shadow-2xl p-12 my-12 max-w-5xl w-full h-[80vh] flex flex-col items-center justify-center relative`}>
              <div className="relative w-full h-full">
                {slide.customOverlay && (
                  <div className="absolute inset-0 w-full h-full flex justify-end pointer-events-none z-0">
                    <OverlaySVG
                      id={slide.customOverlay}
                      size={slide.customOverlaySettings?.size || 1}
                      color={slide.customOverlaySettings?.color || '#fff'}
                      opacity={slide.customOverlaySettings?.opacity || 0.15}
                      position={slide.customOverlaySettings?.position || 'center'}
                      className="w-full h-full"
                    />
                  </div>
                )}
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
                  <button
                    className="absolute top-4 right-4 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 z-20"
                    title="Change background"
                    onClick={e => {
                      e.stopPropagation();
                      setGradientPickerTargetIdx(idx + 1);
                      setShowGradientPicker(true);
                    }}
                  >
                    <FaPalette />
                  </button>
                  <h2
                    className="text-white text-4xl md:text-5xl font-semibold text-center mb-6"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={e => handleSlideContentEdit(idx + 1, 'title', e.target.innerText)}
                  >
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p
                      className="text-gray-200 text-xl mb-8 text-center max-w-2xl"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => handleSlideContentEdit(idx + 1, 'subtitle', e.target.innerText)}
                    >
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.content && slide.content.split('\n').length > 1 && (
                    <ul className="mt-2 space-y-4 text-white text-lg w-full max-w-2xl mx-auto">
                      {slide.content.split('\n').map((point, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-3 mt-1">•</span>
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={e => {
                              const updated = [...slide.content.split('\n')];
                              updated[i] = e.target.innerText;
                              handleSlideContentEdit(idx + 1, 'content', updated.join('\n'));
                            }}
                          >
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {slide.content && slide.content.split('\n').length === 1 && !slide.subtitle && (
                    <p
                      className="text-gray-200 text-xl mt-4 text-center max-w-2xl"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={e => handleSlideContentEdit(idx + 1, 'content', e.target.innerText)}
                    >
                      {slide.content}
                    </p>
                  )}
                  {/* Slide image if present */}
                  {slide.image && (
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="rounded-xl w-full max-w-md mx-auto mb-6"
                    />
                  )}
                  {/* Slide blocks if present */}
                  {slide.blocks && (
                    <div className="relative w-full h-full">
                      {slide.blocks.map((block, i) => (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            left: block.x || 100,
                            top: block.y || 100,
                            cursor: 'move',
                            zIndex: 10,
                          }}
                          draggable
                          onDragStart={e => handleBlockDragStart(e, idx + 1, i)}
                          onDrag={e => handleBlockDrag(e, idx + 1, i)}
                          onDragEnd={e => handleBlockDragEnd(e, idx + 1, i)}
                        >
                          {renderBlock(block, i, idx + 1, handleBlockEdit)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default PresentationViewer; 