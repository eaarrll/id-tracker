import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  CheckSquare, 
  Plus, 
  Search, 
  FileText, 
  Bell, 
  RefreshCw, 
  CheckCircle2, 
  FileDown, 
  Trash2, 
  Upload, 
  Activity, 
  Calendar,
  X,
  TrendingUp,
  Info,
  BookOpen,
  Check,
  AlertCircle
} from 'lucide-react';

interface DocumentRequirement {
  id: string;
  name: string;
  checked: boolean;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

interface ComplianceItem {
  id: string;
  name: string;
  category: 'Identity' | 'Transport' | 'Revenue' | 'Residency' | 'Travel';
  code: string;
  nextRenewal: string;
  cycle: string;
  portalUrl: string;
  portalName: string;
  slaDays: number;
  averageCostPhp: number;
  documents: DocumentRequirement[];
  attachments: Attachment[];
  runbookSteps: string[];
  survivalTips: string[];
}

interface SreIncident {
  id: string;
  timestamp: string;
  level: 'CRITICAL' | 'WARNING' | 'STAGED' | 'SUCCESS';
  message: string;
  itemId?: string;
}

interface PortalHealth {
  name: string;
  url: string;
  status: 'OPERATIONAL' | 'HIGH_LOAD' | 'DEGRADED' | 'DOWN';
  responseTimeMs: number;
}

const INITIAL_COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: 'lto-license',
    name: "LTO Driver's License",
    category: 'Transport',
    code: 'DL-N03-203811',
    nextRenewal: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // expires in 5 days for critical demo
    cycle: '10 Years',
    portalUrl: 'https://portal.lto.gov.ph',
    portalName: 'LTO LTMS Portal',
    slaDays: 0.1,
    averageCostPhp: 585,
    documents: [
      { id: 'lto-1', name: 'CDEC Online Medical Certificate (Philsys Registered clinic)', checked: true },
      { id: 'lto-2', name: 'Original Driver’s License Card', checked: true },
      { id: 'lto-3', name: 'LTMS Portal Account Printout & QR Code', checked: false },
      { id: 'lto-4', name: 'Theoretical Examination Certificate (if changing restrictions)', checked: false }
    ],
    attachments: [
      { id: 'att-lto-1', name: 'licensed_scanned_back_and_front.pdf', size: '1.2 MB', uploadedAt: '2025-05-10' }
    ],
    runbookSteps: [
      "Acquire accredited medical certificate from LTO-registered clinic (digitally linked to LTMS portal).",
      "Log into LTMS portal online and schedule appointment.",
      "Present original license, medical certificate, and LTMS Client ID.",
      "Proceed to fingerprint capture, signature confirmation, and photography.",
      "Pay license renewal fee.",
      "Collect new plastic cards immediately at delivery counter."
    ],
    survivalTips: [
      "Clinic Sync: Medical certificates must be issued by LTO-accredited clinics who transmit results directly to the LTMS database. Offline or unaccredited clinic certificates are rejected.",
      "Exam Online Practice: If you need to retake the theoretical driving exam due to structural demotion or renewal lapse, practice within your online LTMS portal. Passing rate is 80%."
    ]
  },
  {
    id: 'nbi-clearance',
    name: 'NBI Clearance',
    category: 'Identity',
    code: 'REF-NBI-2026-X118',
    nextRenewal: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // expires in 25 days for warning demo
    cycle: 'Annual',
    portalUrl: 'https://clearance.nbi.gov.ph',
    portalName: 'NBI Clearance Online',
    slaDays: 0.5,
    averageCostPhp: 160,
    documents: [
      { id: 'nbi-1', name: 'Two (2) Government-issued valid IDs', checked: true },
      { id: 'nbi-2', name: 'Printed Reference Number / Application Form', checked: true },
      { id: 'nbi-3', name: 'Official GCash / PayMaya E-Payment Receipt', checked: false }
    ],
    attachments: [],
    runbookSteps: [
      "Navigate to clearance.nbi.gov.ph and register/log in.",
      "Fill out complete biodata details accurately.",
      "Reserve an online scheduling slot and choose an NBI branch.",
      "Select payment method, capture reference code, and process payment.",
      "Attend the branch on your scheduled date for biometrics.",
      "Claim clearance card (subject to a multi-day wait if on HIT registry)."
    ],
    survivalTips: [
      "HIT Delays: If you have a common Filipino first and last name combination, expect a 'HIT' classification during processing, which delays clearance release by 10-14 business days. Plan well in advance.",
      "Online Confirmation: Use online payment (GCash/Maya) directly to auto-confirm reference numbers and bypass additional accounting rows."
    ]
  },
  {
    id: 'dfa-passport',
    name: 'Philippine Passport',
    category: 'Identity',
    code: 'EP48201A',
    nextRenewal: '2032-03-12',
    cycle: '10 Years',
    portalUrl: 'https://passport.gov.ph',
    portalName: 'DFA Passport Appointment Portal',
    slaDays: 12,
    averageCostPhp: 1200,
    documents: [
      { id: 'dfa-1', name: 'PSA Birth Certificate (Original + Photocopy)', checked: true },
      { id: 'dfa-2', name: 'LTO License or UMID with true copy', checked: true },
      { id: 'dfa-3', name: 'DFA Official Appointment Confirmation Receipt', checked: true },
      { id: 'dfa-4', name: 'Self-Addressed LBC Delivery Envelope (optional)', checked: false }
    ],
    attachments: [
      { id: 'att-dfa-1', name: 'psa_birth_certificate_certified.pdf', size: '2.8 MB', uploadedAt: '2026-01-15' },
      { id: 'att-dfa-2', name: 'passport_bio_page_old.pdf', size: '945 KB', uploadedAt: '2026-01-20' }
    ],
    runbookSteps: [
      "Access passport.gov.ph and schedule an appointment.",
      "Pay regular or express processing fee online.",
      "Secure original PSA birth certificate plus acceptable valid ID.",
      "Report to DFA Consular Office on time and dress formally.",
      "Complete biometrics data capture.",
      "Wait 7-12 work days for delivery to home address."
    ],
    survivalTips: [
      "Strict Dress Code: No earrings, necklaces, contact lenses, or heavy makeup are allowed. Wear a collared shirt or decent blouse for biometric photography.",
      "PSA Quality: Your PSA Birth Certificate must be highly legible and printed on security paper. Outdated, faded, or torn certificates are grounds for immediate rejection."
    ]
  },
  {
    id: 'prc-license',
    name: 'PRC License Card (Civil Engineering)',
    category: 'Identity',
    code: 'REG-CE-009182A',
    nextRenewal: '2028-11-20',
    cycle: '3 Years',
    portalUrl: 'https://online.prc.gov.ph',
    portalName: 'PRC LERIS Portal',
    slaDays: 1,
    averageCostPhp: 450,
    documents: [
      { id: 'prc-1', name: 'Completed Oath Form printable via LERIS', checked: false },
      { id: 'prc-2', name: 'Authenticated CPD units summary sheet', checked: true },
      { id: 'prc-3', name: 'Two (2) Passport size photos with white background and name tag', checked: false }
    ],
    attachments: [],
    runbookSteps: [
      "Accumulate required CPD (Continuing Professional Development) units.",
      "Sign in onto the LERIS PRC portal website.",
      "Select Renewal service, pay the filing fee, and print application.",
      "Arrive at selected regional branch with application form.",
      "Get card printed and issued."
    ],
    survivalTips: [
      "CPD Compliance: Doublecheck if your current profession falls under the temporary relaxation of Continuing Professional Development units. Check LERIS before scheduling transactions.",
      "PIC Venue: Make sure to select regional centers with printing capability if you require immediate physical card release."
    ]
  },
  {
    id: 'bir-1701q',
    name: 'BIR Form 1701Q (Quarterly Income Tax)',
    category: 'Revenue',
    code: 'TIN-402-998-119',
    nextRenewal: '2026-08-15',
    cycle: 'Quarterly',
    portalUrl: 'https://www.bir.gov.ph',
    portalName: 'BIR eFPS / eBIRForms',
    slaDays: 0.1,
    averageCostPhp: 0,
    documents: [
      { id: 'bir-q1', name: 'SAWT (Summary Alphalist) .dat attachment', checked: false },
      { id: 'bir-q2', name: 'Form 2307 Creditable Tax Withheld documents', checked: true },
      { id: 'bir-q3', name: 'Quarterly income workbook ledgers', checked: true }
    ],
    attachments: [],
    runbookSteps: [
      "Install latest offline eBIRForms package.",
      "Fill out personal information profile and select form 1701Q.",
      "Fill in aggregate gross revenues and applicable withholding deductions.",
      "Validate structure, submit electronically, and check for BIR inbox acknowledgment email.",
      "Pay corresponding taxes using GCash, Maya, or Authorized Banks before deadlines."
    ],
    survivalTips: [
      "BIR Inbox Slip: The validation receipt that arrives via automated email is critical. Always print and archive this acknowledgment slip alongside the form layout as official audit backup.",
      "Surcharges Alarm: Missing quarterly tax filing deadlines triggers automatic 25% surcharges immediately on any unpaid balances. Set rigid recurring tracking parameters."
    ]
  },
  {
    id: 'vehicle-or-cr',
    name: 'LTO Vehicle OR/CR Registration',
    category: 'Transport',
    code: 'PLATE-NFZ-1982',
    nextRenewal: '2026-10-18',
    cycle: 'Annual',
    portalUrl: 'https://portal.lto.gov.ph',
    portalName: 'LTO LTMS Engine',
    slaDays: 1,
    averageCostPhp: 2450,
    documents: [
      { id: 'vehicle-1', name: 'CTPL (Third Party Liability) Insurance Policy', checked: true },
      { id: 'vehicle-2', name: 'MVIR Roadworthiness Inspection report', checked: false },
      { id: 'vehicle-3', name: 'Original Receipt (OR) & Certificate of Registro (CR)', checked: true },
      { id: 'vehicle-4', name: 'Online Emissions Testing digital record', checked: false }
    ],
    attachments: [],
    runbookSteps: [
      "Identify the assigned registration week target using structural plate ending digits.",
      "Procure valid CTPL auto-insurance certificate.",
      "Pass motor emission testing and coordinate the direct PMVIC data uploads to LTO systems.",
      "Carry physically signed insurance, PMVIC copy, and duplicate OR/CRs to window.",
      "Submit logs, process transaction payment, and compile updated OR."
    ],
    survivalTips: [
      "Plate End Timing: The scheduled registry month depends on the last digit of your plate number (e.g., Ending in 8 = October). The weekly block depends on the middle digit.",
      "Digital Upload Verification: Ensure that your accredited private emission testing center successfully uploads the digital testing record into the LTO database before you line up at physical lanes."
    ]
  },
  {
    id: 'condo-dues',
    name: 'Condo Association Dues',
    category: 'Residency',
    code: 'UNIT-1402-CONDO',
    nextRenewal: '2026-06-05',
    cycle: 'Monthly (Day 05)',
    portalUrl: 'https://www.bdo.com.ph',
    portalName: 'Mobile Banking Portal',
    slaDays: 0.05,
    averageCostPhp: 3820,
    documents: [
      { id: 'condo-1', name: 'Monthly Statement of Account (SOA)', checked: true },
      { id: 'condo-2', name: 'Proof of GCash/Bank online delivery receipt', checked: false }
    ],
    attachments: [
      { id: 'att-condo-1', name: 'pioneer_soa_may_2026.pdf', size: '430 KB', uploadedAt: '2026-05-01' }
    ],
    runbookSteps: [
      "Obtain Statement of Account bill from PMO coordinators.",
      "Confirm water, maintenance fees, and specific dues balances.",
      "Proceed to log into banking app and choose Condo Merchant bills payment.",
      "Save receipt copy and submit to property admins for parking sticker renewals."
    ],
    survivalTips: [
      "Water Locks: Property admin systems dynamically lock utility meters within 48-72 hours of unpaid accounts. Always trigger bank transactions before Day 05.",
      "Parking Pass Validation: Provide a scanned proof of remittance directly to the PMO admin inbox to prevent automatic cancellation of electronic building access stickers."
    ]
  }
];

const INITIAL_HEALTH_MONITOR: PortalHealth[] = [
  { name: 'LTO LTMS Portal', url: 'https://portal.lto.gov.ph', status: 'OPERATIONAL', responseTimeMs: 142 },
  { name: 'DFA Scheduler', url: 'https://passport.gov.ph', status: 'HIGH_LOAD', responseTimeMs: 1240 },
  { name: 'BIR eFPS Core', url: 'https://efps.bir.gov.ph', status: 'DEGRADED', responseTimeMs: 3450 },
  { name: 'NBI Online Gate', url: 'https://clearance.nbi.gov.ph', status: 'OPERATIONAL', responseTimeMs: 250 },
  { name: 'PRC LERIS Engine', url: 'https://online.prc.gov.ph', status: 'OPERATIONAL', responseTimeMs: 180 },
  { name: 'Philsys Registry API', url: 'https://philsys.gov.ph', status: 'DOWN', responseTimeMs: 0 }
];

export default function App() {
  const [items, setItems] = useState<ComplianceItem[]>(() => {
    const saved = localStorage.getItem('ph_compliance_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_COMPLIANCE_ITEMS;
      }
    }
    return INITIAL_COMPLIANCE_ITEMS;
  });

  const [activeTab, setActiveTab] = useState<'All' | 'Identity' | 'Transport' | 'Revenue' | 'Residency' | 'Travel'>('All');
  const [selectedItemId, setSelectedItemId] = useState<string>(() => {
    return items.length > 0 ? items[0].id : '';
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  const [portalHealths, setPortalHealths] = useState<PortalHealth[]>(INITIAL_HEALTH_MONITOR);
  const [isRefreshingSLA, setIsRefreshingSLA] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCode, setNewItemCode] = useState('');
  const [newItemCat, setNewItemCat] = useState<'Identity' | 'Transport' | 'Revenue' | 'Residency' | 'Travel'>('Identity');
  const [newItemNext, setNewItemNext] = useState('');
  const [newItemCycle, setNewItemCycle] = useState('Annual');
  const [newItemPortalUrl, setNewItemPortalUrl] = useState('');
  const [newItemPortalName, setNewItemPortalName] = useState('');
  const [newItemSla, setNewItemSla] = useState('1');
  const [newItemCost, setNewItemCost] = useState('0');
  const [newRunbookText, setNewRunbookText] = useState('');

  const [submitTimeDays, setSubmitTimeDays] = useState('');
  const [submitTimeBranch, setSubmitTimeBranch] = useState('');

  const [incidents, setIncidents] = useState<SreIncident[]>([
    {
      id: 'inc-1',
      timestamp: '08:01:05',
      level: 'CRITICAL',
      message: "LTO Driver's License trigger: expires in 5 days (T-Minus threshold breached)",
      itemId: 'lto-license'
    },
    {
      id: 'inc-2',
      timestamp: '08:04:12',
      level: 'WARNING',
      message: 'NBI Clearance staged alert: 25 days remaining. Recommending background checks scheduling.',
      itemId: 'nbi-clearance'
    }
  ]);

  const [simulatedAlertSuccess, setSimulatedAlertSuccess] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ph_compliance_items', JSON.stringify(items));
  }, [items]);

  // Ensure that if selectedItemId doesn't exist anymore or is empty, we fall back to first item if available
  const selectedItem = items.find(item => item.id === selectedItemId) || items[0] || null;

  const getDaysRemaining = (dateStr: string) => {
    const diffTime = new Date(dateStr).getTime() - Date.now();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyClass = (days: number) => {
    if (days <= 7) return { 
      badge: 'bg-red-50 text-red-700 border-red-200', 
      text: 'text-red-600', 
      cardBg: 'bg-red-50/10',
      cardBorder: 'border-l-4 border-l-red-500',
      status: 'CRITICAL'
    };
    if (days <= 30) return { 
      badge: 'bg-amber-50 text-amber-700 border-amber-200', 
      text: 'text-amber-600', 
      cardBg: 'bg-amber-50/10',
      cardBorder: 'border-l-4 border-l-amber-500',
      status: 'WARNING'
    };
    if (days <= 60) return { 
      badge: 'bg-blue-50 text-blue-700 border-blue-200', 
      text: 'text-blue-600', 
      cardBg: 'bg-blue-50/10',
      cardBorder: 'border-l-4 border-l-blue-400',
      status: 'MONITORING'
    };
    return { 
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', 
      text: 'text-emerald-700', 
      cardBg: 'bg-emerald-50/10',
      cardBorder: 'border-l-4 border-l-emerald-500',
      status: 'COMPLIANT'
    };
  };

  const triggerSimulateAlert = (daysThreshold: 60 | 30 | 7, itemName: string, itemId: string) => {
    const logTime = new Date().toTimeString().split(' ')[0];
    const newInc: SreIncident = {
      id: `sim-inc-${Date.now()}`,
      timestamp: logTime,
      level: daysThreshold === 7 ? 'CRITICAL' : daysThreshold === 30 ? 'WARNING' : 'STAGED',
      message: `SIMULATED PUSH ALERT: ${itemName} is T-minus ${daysThreshold} Days from expiration cycle target!`,
      itemId: itemId
    };
    setIncidents(prev => [newInc, ...prev]);
    setSimulatedAlertSuccess(`Simulated ${daysThreshold}-Day push alert emitted inside incident manager for "${itemName}"!`);
    setTimeout(() => setSimulatedAlertSuccess(null), 4000);
  };

  const handleToggleDoc = (itemId: string, docId: string) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          const updatedDocs = item.documents.map(doc => {
            if (doc.id === docId) {
              return { ...doc, checked: !doc.checked };
            }
            return doc;
          });
          return { ...item, documents: updatedDocs };
        }
        return item;
      })
    );
  };

  const [newDocText, setNewDocText] = useState('');
  const handleAddCustomDoc = (itemId: string) => {
    if (!newDocText.trim()) return;
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          const newDoc: DocumentRequirement = {
            id: `doc-custom-${Date.now()}`,
            name: newDocText.trim(),
            checked: false
          };
          return { ...item, documents: [...item.documents, newDoc] };
        }
        return item;
      })
    );
    setNewDocText('');
  };

  const handleDeleteItem = (itemId: string) => {
    const confirmation = window.confirm("Are you sure you want to stop tracking this document item?");
    if (!confirmation) return;
    const remainingItems = items.filter(item => item.id !== itemId);
    setItems(remainingItems);
    if (selectedItemId === itemId) {
      if (remainingItems.length > 0) {
        setSelectedItemId(remainingItems[0].id);
      } else {
        setSelectedItemId('');
      }
    }
  };

  const [dragOverActive, setDragOverActive] = useState(false);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverActive(true);
  };
  const handleDragLeave = () => {
    setDragOverActive(false);
  };
  const handleDrop = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    setDragOverActive(false);
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length === 0) return;
    
    const newAttachments: Attachment[] = files.map(file => ({
      id: `att-sim-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0]
    }));

    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, attachments: [...item.attachments, ...newAttachments] };
        }
        return item;
      })
    );

    const timestamp = new Date().toTimeString().split(' ')[0];
    const itemObj = items.find(i => i.id === itemId);
    const itemName = itemObj ? itemObj.name : "Target item";
    setIncidents(prev => [
      {
        id: `att-inc-${Date.now()}`,
        timestamp,
        level: 'SUCCESS',
        message: `DEPOSITED OBJECT: Securely staged ${files.length} documents into "${itemName}" memory locker.`,
        itemId
      },
      ...prev
    ]);
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const files = (e.target.files ? Array.from(e.target.files) : []) as File[];
    if (files.length === 0) return;

    const newAttachments: Attachment[] = files.map(file => ({
      id: `att-sim-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: new Date().toISOString().split('T')[0]
    }));

    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, attachments: [...item.attachments, ...newAttachments] };
        }
        return item;
      })
    );

    const timestamp = new Date().toTimeString().split(' ')[0];
    const itemObj = items.find(i => i.id === itemId);
    const itemName = itemObj ? itemObj.name : "Target item";
    setIncidents(prev => [
      {
        id: `att-inc-${Date.now()}`,
        timestamp,
        level: 'SUCCESS',
        message: `DEPOSITED OBJECT: Uploaded credential copy file to "${itemName}" secure storage.`,
        itemId
      },
      ...prev
    ]);

    e.target.value = '';
  };

  const deleteAttachment = (itemId: string, attachmentId: string) => {
    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          return { ...item, attachments: item.attachments.filter(att => att.id !== attachmentId) };
        }
        return item;
      })
    );
  };

  const handleCreateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemCode.trim()) {
      alert("Please key in a name and tracking code/plate reference!");
      return;
    }

    const customId = `custom-doc-${Date.now()}`;
    const formattedDate = newItemNext || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const stepsArray = newRunbookText
      ? newRunbookText.split('\n').filter(s => s.trim().length > 0)
      : ["Navigate to official government internet portal.", "Complete digital biodata forms.", "Pay scheduled processing fees.", "Claim issued physical document."];

    const newItem: ComplianceItem = {
      id: customId,
      name: newItemName.trim(),
      category: newItemCat,
      code: newItemCode.trim(),
      nextRenewal: formattedDate,
      cycle: newItemCycle,
      portalUrl: newItemPortalUrl.trim() || 'https://www.gov.ph',
      portalName: newItemPortalName.trim() || 'Philippine Government Portal',
      slaDays: parseFloat(newItemSla) || 1,
      averageCostPhp: parseInt(newItemCost) || 0,
      documents: [
        { id: `doc-init-1`, name: 'Primary valid identification photocopy', checked: false },
        { id: `doc-init-2`, name: 'Original physical copy of outdated credential', checked: false }
      ],
      attachments: [],
      runbookSteps: stepsArray,
      survivalTips: [
        "Digital Check: Ensure you verify scheduling guidelines online beforehand. Many Philippine regional centers operate strictly on appointment slots.",
        "Secure Storage: Upload scanned back-and-front copies into the file cabinet drawer of this item to enable easy offline access."
      ]
    };

    setItems(prev => [...prev, newItem]);
    setSelectedItemId(customId);
    setShowAddModal(false);

    setIncidents(prev => [
      {
        id: `reg-inc-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        level: 'STAGED',
        message: `REGISTERED ASSET: Added "${newItem.name}" tracking sequence targeting checkpoint date ${formattedDate}.`,
        itemId: customId
      },
      ...prev
    ]);

    setNewItemName('');
    setNewItemCode('');
    setNewItemCat('Identity');
    setNewItemNext('');
    setNewItemCycle('Annual');
    setNewItemPortalUrl('');
    setNewItemPortalName('');
    setNewItemSla('1');
    setNewItemCost('0');
    setNewRunbookText('');
  };

  const handleSubmitSlaCrowdsource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId) return;
    const parsedDays = parseFloat(submitTimeDays);
    if (isNaN(parsedDays) || parsedDays <= 0) {
      alert("Please key in valid processing hours/days!");
      return;
    }

    setItems(prevItems => 
      prevItems.map(item => {
        if (item.id === selectedItemId) {
          // Compute running average: (3 * existing + new) / 4
          const updatedSla = parseFloat(((item.slaDays * 3 + parsedDays) / 4).toFixed(3));
          return { ...item, slaDays: updatedSla };
        }
        return item;
      })
    );

    setSubmitTimeDays('');
    setSubmitTimeBranch('');

    setIncidents(prev => [
      {
        id: `sla-inc-${Date.now()}`,
        timestamp: new Date().toTimeString().split(' ')[0],
        level: 'SUCCESS',
        message: `SLA METRIC COLLATED: Crowdsourced feedback updated processing speed metrics for "${selectedItem ? selectedItem.name : 'Asset'}".`,
        itemId: selectedItemId
      },
      ...prev
    ]);

    alert("Mabuhay! Your processing time metric has been crowd-collated successfully.");
  };

  const triggerHealthReping = () => {
    setIsRefreshingSLA(true);
    setTimeout(() => {
      setPortalHealths(prev => 
        prev.map(p => {
          const rand = Math.random();
          let nextStatus: 'OPERATIONAL' | 'HIGH_LOAD' | 'DEGRADED' | 'DOWN' = p.status;
          if (rand > 0.6) {
            const statuses: Array<'OPERATIONAL' | 'HIGH_LOAD' | 'DEGRADED' | 'DOWN'> = ['OPERATIONAL', 'HIGH_LOAD', 'DEGRADED', 'DOWN'];
            nextStatus = statuses[Math.floor(Math.random() * statuses.length)];
          }
          return {
            ...p,
            status: nextStatus,
            responseTimeMs: nextStatus === 'DOWN' ? 0 : Math.floor(Math.random() * 800) + 100
          };
        })
      );
      setIsRefreshingSLA(false);
      
      setIncidents(prevInc => [
        {
          id: `ping-${Date.now()}`,
          timestamp: new Date().toTimeString().split(' ')[0],
          level: 'SUCCESS',
          message: 'PING ROUTINE EXECUTION: Re-pinger resolved regional agency gateway response latency.',
        },
        ...prevInc
      ]);
    }, 1000);
  };

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'All' || item.category === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalTracked = items.length;
  const criticalCount = items.filter(i => getDaysRemaining(i.nextRenewal) <= 7).length;
  const warningCount = items.filter(i => getDaysRemaining(i.nextRenewal) > 7 && getDaysRemaining(i.nextRenewal) <= 30).length;
  const compliantCount = totalTracked - criticalCount - warningCount;
  const complianceUptimePct = totalTracked > 0 ? Math.round((compliantCount / totalTracked) * 100) : 100;

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans overflow-x-hidden antialiased selection:bg-indigo-100">
      
      {/* HEADER SECTION */}
      <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-4 lg:px-8 shadow-md shrink-0 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-inner" id="app-logo-bg">
            <Shield className="w-6 h-6 animate-pulse" id="app-logo-svg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base lg:text-lg tracking-tight text-white flex items-center gap-1.5 uppercase">
                SRE-PH <span className="text-indigo-400">Life Admin</span>
              </h1>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">
                V4.0
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-semibold tracking-widest uppercase">
              Personal Bureaucracy Compliance Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20 text-[11px] font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM SLO: {complianceUptimePct}% COMPLIANT
          </div>

          <div className="h-8 w-[1px] bg-slate-700 hidden sm:block"></div>

          <div className="text-right font-sans">
            <p className="text-xs font-bold text-slate-100">JUAN DELA CRUZ</p>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-mono">Citizen Node #7102-PH</p>
          </div>
        </div>
      </header>

      {simulatedAlertSuccess && (
        <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-semibold animate-fade-in transition-all shadow-md z-40">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 animate-bounce" />
            {simulatedAlertSuccess}
          </span>
          <button onClick={() => setSimulatedAlertSuccess(null)} className="hover:opacity-80 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DASHBOARD GRID CONTENT */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: TELEMETRY & GATEWAY HEALTHES */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* CONSOLIDATED METRICS CARD */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4" id="sre-metrics-widget">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">
                Compliance SLO Metrics
              </h3>
              <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
                Live Coverage
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg flex flex-col justify-between">
                <p className="text-2xl font-black text-emerald-800 font-mono">{compliantCount}</p>
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight mt-1">Compliant</p>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-lg flex flex-col justify-between">
                <p className="text-2xl font-black text-amber-800 font-mono">{warningCount}</p>
                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-tight mt-1">Warning</p>
              </div>
              <div className="bg-red-50/50 border border-red-100 p-3 rounded-lg flex flex-col justify-between">
                <p className="text-2xl font-black text-red-800 font-mono">{criticalCount}</p>
                <p className="text-[9px] font-bold text-red-650 uppercase tracking-tight mt-1">Critical</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs text-slate-650 mb-1.5">
                <span className="font-semibold text-slate-605">Personal Bureaucracy Index (PBI)</span>
                <span className="font-bold text-indigo-700">{complianceUptimePct}% <span className="text-slate-400 font-normal">(Target 90%)</span></span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner">
                <div 
                  className={`h-full transition-all duration-500 ${
                    complianceUptimePct < 70 ? 'bg-red-500' : complianceUptimePct < 90 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} 
                  style={{ width: `${complianceUptimePct}%` }}
                ></div>
              </div>
            </div>

            {/* DYNAMIC SPARKLINE VISUALIZATION WITH SVG */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  SLA Timeline Response Signal
                </span>
                <span className="text-[9px] text-emerald-600 font-mono flex items-center gap-1 font-bold">
                  ● PHT Nominal
                </span>
              </div>
              <div className="bg-slate-900 rounded-lg p-2.5 h-16 flex items-center relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path 
                    d="M 0 60 Q 15 40 30 70 T 60 30 T 90 20 L 100 20 L 100 100 L 0 100 Z" 
                    fill="url(#sparkline-grad)" 
                    opacity="0.25"
                  />
                  <path 
                    d="M 0 60 Q 15 40 30 70 T 60 30 T 90 20 L 100 20" 
                    fill="none" 
                    stroke="#4f46e5" 
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="sparkline-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="z-10 flex w-full justify-between px-1 text-[10px] text-slate-400 font-mono font-semibold">
                  <span>Q1/26</span>
                  <span>Q2/26 (NOW)</span>
                  <span className="text-indigo-400">99.2%</span>
                </div>
              </div>
            </div>
          </section>

          {/* ACTIVE CRITICAL ALERTS & INCIDENT QUEUE */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" id="incident-t-minus-feed">
            <div className="bg-slate-900 text-slate-100 px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
              <h2 className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-white">
                <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
                Active SRE Checkpoint Alerts
              </h2>
              <span className="bg-amber-500 text-slate-950 text-[10px] px-2.5 py-0.5 rounded-full font-black font-mono tracking-wider">
                {criticalCount + warningCount} TRIGGERS
              </span>
            </div>

            <div className="p-4 flex flex-col gap-3 max-h-[300px] overflow-y-auto">
              {items.map(item => {
                const daysRemaining = getDaysRemaining(item.nextRenewal);
                const isUrgent = daysRemaining <= 30;
                if (!isUrgent) return null;

                const urgency = getUrgencyClass(daysRemaining);

                return (
                  <div 
                    key={`incident-${item.id}`}
                    id={`active-incident-${item.id}`}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer hover:shadow transition-all ${
                      daysRemaining <= 7 
                        ? 'bg-red-50/45 border-red-200 hover:bg-red-50' 
                        : 'bg-amber-55/10 border-amber-300 hover:bg-amber-50/60'
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${daysRemaining <= 7 ? 'bg-red-600 animate-ping' : 'bg-amber-500'}`}></span>
                        <p className="text-xs font-black text-slate-800 uppercase truncate">
                          {item.name}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 font-bold uppercase">
                        {item.code} • T-Minus {daysRemaining} days!
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button 
                        id={`renew-btn-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItemId(item.id);
                        }}
                        className={`px-3 py-1 text-[10px] font-black rounded shadow-sm transition-colors ${
                          daysRemaining <= 7 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-amber-600 text-white hover:bg-amber-700'
                        }`}
                      >
                        RENEW
                      </button>
                    </div>
                  </div>
                );
              })}

              {criticalCount + warningCount === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2.5" />
                  <p className="text-[11px] font-black uppercase text-slate-700">All Nodes Secure</p>
                  <p className="text-[10px] text-slate-500 max-w-xs mt-1">No pending bureaucratic incidents. All document renewals mapped to safe time frames.</p>
                </div>
              )}
            </div>
          </section>

          {/* PORTAL API LIFELINES & LIVE HEALTH STATUS */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-indigo-600 animate-pulse" />
                  Government Gateway Status
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">Real-time ping monitor of agency digital portals</p>
              </div>
              <button 
                id="reping-gateways-btn"
                onClick={triggerHealthReping}
                disabled={isRefreshingSLA}
                className="text-[10px] text-indigo-600 border border-indigo-200 rounded px-3 py-1.5 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300 flex items-center gap-1 disabled:opacity-50 select-none font-bold"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshingSLA ? 'animate-spin' : ''}`} />
                PING GATE
              </button>
            </div>

            <div className="p-4 space-y-2.5">
              {portalHealths.map((portal) => {
                const isOnline = portal.status === 'OPERATIONAL';
                const isLoad = portal.status === 'HIGH_LOAD';
                const isDegraded = portal.status === 'DEGRADED';
                const isDown = portal.status === 'DOWN';

                let statusBadge = 'bg-emerald-50 text-emerald-800 border-emerald-100';
                let statusDot = 'bg-emerald-500';
                if (isLoad) { statusBadge = 'bg-amber-50 text-amber-800 border-amber-150'; statusDot = 'bg-amber-400'; }
                else if (isDegraded) { statusBadge = 'bg-orange-50 text-orange-850 border-orange-100'; statusDot = 'bg-orange-400'; }
                else if (isDown) { statusBadge = 'bg-red-50 text-red-800 border-red-150'; statusDot = 'bg-red-500 animate-pulse'; }

                return (
                  <div 
                    key={portal.name} 
                    id={`gateway-row-${portal.name.replace(/\s+/g, '-').toLowerCase()}`}
                    className="flex justify-between items-center text-xs py-1.5 px-2 hover:bg-slate-50 rounded transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-slate-800 text-[11px]">{portal.name}</p>
                      <a 
                        href={portal.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[9px] text-slate-400 hover:text-indigo-600 hover:underline flex items-center gap-0.5 truncate font-mono mt-0.5"
                      >
                        {portal.url.replace('https://', '')} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-2">
                      <span className="font-bold text-[10px] text-slate-500 font-mono">
                        {portal.status === 'DOWN' ? 'ERR/502' : `${portal.responseTimeMs}ms`}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[9px] font-black rounded border flex items-center gap-1 ${statusBadge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
                        {portal.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: SEARCH, BENTO REGISTRY GRID, WORKSPACE DETAILS */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* CONTROL STRIP */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between" id="dashboard-controls">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-450" />
              <input 
                id="search-bar-input"
                type="text"
                placeholder="Search database index (e.g. Passport, Plate, TIN)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-55/40 text-slate-800 transition-shadow"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {(['All', 'Identity', 'Transport', 'Revenue', 'Residency', 'Travel'] as const).map((category) => (
                <button
                  key={category}
                  id={`filter-btn-${category.toLowerCase()}`}
                  onClick={() => setActiveTab(category)}
                  className={`text-[10px] lg:text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                    activeTab === category 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>

            <button 
              id="track-new-item-btn"
              onClick={() => setShowAddModal(true)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-xs font-black shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              TRACK NEW ASSET
            </button>
          </div>

          {/* COMPLIANCE REGISTRY GRID */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="compliance-registry-grid">
              {filteredItems.map((item) => {
                const daysRemaining = getDaysRemaining(item.nextRenewal);
                const urgency = getUrgencyClass(daysRemaining);
                const isSelected = item.id === selectedItemId;

                const checkedCount = item.documents.filter(d => d.checked).length;
                const totalDocs = item.documents.length;
                const percentReady = totalDocs > 0 ? Math.round((checkedCount / totalDocs) * 100) : 0;

                return (
                  <div 
                    key={item.id}
                    id={`compliance-card-${item.id}`}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`bg-white rounded-xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative shadow-sm hover:shadow-md ${
                      isSelected ? 'ring-2 ring-indigo-600 border-transparent shadow-md transform -translate-y-0.5' : 'border-slate-200'
                    } ${urgency.cardBorder}`}
                  >
                    <div className="p-4.5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Upper Details */}
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block">
                              {item.category} Registry Unit
                            </span>
                            <h4 className="text-sm font-black text-slate-800 tracking-tight mt-1 leading-tight line-clamp-1">
                              {item.name}
                            </h4>
                          </div>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-mono font-bold rounded uppercase truncate max-w-[120px]" title={item.code}>
                            {item.code}
                          </span>
                        </div>

                        {/* Middle Details */}
                        <div className="mt-4 space-y-2 text-[11px] text-slate-650">
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Cadence Cycle</span>
                            <span className="font-bold text-slate-700">{item.cycle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500 font-medium">Checkpoint Target</span>
                            <span className="font-bold text-slate-700">{item.nextRenewal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress and Checklist indicators */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <div className="flex justify-between text-[11px] items-center mb-1 font-sans">
                          <span className="text-slate-500 font-medium">Step Checklist</span>
                          <span className="text-[10px] font-bold text-slate-700">
                            {checkedCount}/{totalDocs} ({percentReady}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                          <div className="bg-indigo-600 h-full" style={{ width: `${percentReady}%` }}></div>
                        </div>
                      </div>

                    </div>

                    <div className="bg-slate-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between text-[11px]">
                      <span className={`font-black font-mono text-[10px] tracking-tight uppercase ${urgency.text}`}>
                        {daysRemaining <= 0 ? 'OVERDUE' : `T-${daysRemaining} DAYS`}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase ${urgency.badge}`}>
                        {urgency.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center">
              <AlertCircle className="w-12 h-12 text-slate-350 mb-3" />
              <p className="text-sm font-black text-slate-700 uppercase">No registry match found</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">Refine your search tags or click "TRACK NEW ASSET" to register a different bureaucracy sequence.</p>
            </div>
          )}

          {/* ACTIVE SELECTED ASSET WORKSPACE CONTAINER */}
          {selectedItem ? (
            <section 
              id={`document-workspace-${selectedItem.id}`}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="bg-slate-900 text-white p-4 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black bg-indigo-600 px-2 py-0.5 rounded uppercase tracking-wider text-white">
                      {selectedItem.category} PIPELINE
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">ID: {selectedItem.id}</span>
                  </div>
                  <h3 className="text-[17px] font-black uppercase tracking-tight mt-1 text-white flex items-center gap-2">
                    {selectedItem.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-sans leading-relaxed">
                    <Calendar className="w-4 h-4 shrink-0 text-slate-300" /> Active Registry Code: <strong className="text-slate-200 font-mono font-bold">{selectedItem.code}</strong> | Expiration: <strong className="text-indigo-300 font-extrabold">{selectedItem.nextRenewal}</strong>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a 
                    id={`external-portal-link-${selectedItem.id}`}
                    href={selectedItem.portalUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    OPEN CLIENT GATEWAY
                  </a>
                  
                  <button 
                    id={`delete-btn-${selectedItem.id}`}
                    onClick={() => handleDeleteItem(selectedItem.id)}
                    className="p-2.5 border border-slate-700 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors"
                    title="Stop Tracking this Asset"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-100">
                
                {/* CHECKLISTS & FILE STORAGE LOCKER (7 OF 12 COLS) */}
                <div className="lg:col-span-7 p-4 lg:p-6 border-r border-slate-100 flex flex-col gap-6.5">
                  
                  {/* DOCUMENT REQUIREMENT CHECKLIST */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                        Bureaucratic Pipeline Requirements Checklist
                      </h4>
                      <span className="text-[10px] text-slate-500 font-bold font-mono">
                        {selectedItem.documents.filter(d => d.checked).length}/{selectedItem.documents.length} SECURED
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      {selectedItem.documents.map((doc) => (
                        <div 
                          key={doc.id}
                          id={`checklist-row-${doc.id}`}
                          onClick={() => handleToggleDoc(selectedItem.id, doc.id)}
                          className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                            doc.checked 
                              ? 'bg-slate-50/70 border-indigo-200 text-slate-850 font-bold shadow-xs' 
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50/50'
                          }`}
                        >
                          <span className="shrink-0 mt-0.5" id={`checklist-chk-${doc.id}`}>
                            {doc.checked ? (
                              <div className="w-4.5 h-4.5 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-4.5 h-4.5 rounded-md border border-slate-350 bg-white" />
                            )}
                          </span>
                          <span className="leading-snug">{doc.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <input 
                        id="add-doc-requirement-input"
                        type="text"
                        placeholder="Add secondary certification requirement..."
                        value={newDocText}
                        onChange={(e) => setNewDocText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCustomDoc(selectedItem.id)}
                        className="flex-1 px-3 py-2 text-xs font-semibold border border-slate-250 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50"
                      />
                      <button 
                        id="add-doc-requirement-btn"
                        onClick={() => handleAddCustomDoc(selectedItem.id)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-250 px-4 py-2 rounded-lg text-xs font-black transition-colors shrink-0"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* SECURE LOCAL DOCUMENT FILE LOCKER */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileDown className="w-4 h-4 text-indigo-600 animate-pulse" />
                      Encrypted Personal File Cabinet
                    </h4>

                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, selectedItem.id)}
                      className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer relative ${
                        dragOverActive 
                          ? 'border-indigo-500 bg-indigo-50/50' 
                          : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50/40'
                      }`}
                    >
                      <input 
                        id={`file-picker-trigger-${selectedItem.id}`}
                        type="file" 
                        multiple 
                        onChange={(e) => handleSimulateFileUpload(e, selectedItem.id)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-9 h-9 text-slate-450 mx-auto mb-2" />
                      <p className="text-xs font-black text-slate-700">Drag & drop scanned PDF/PNG here or click to browse</p>
                      <p className="text-[10px] text-slate-450 mt-1 font-mono">Simulates high-grade local storage encryption (Max 15MB)</p>
                    </div>

                    {selectedItem.attachments && selectedItem.attachments.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {selectedItem.attachments.map((file) => (
                          <div 
                            key={file.id} 
                            className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between text-xs hover:bg-slate-100/50 font-mono transition-colors shadow-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                              <div className="min-w-0 font-sans">
                                <p className="font-bold text-slate-805 truncate text-[11px]" title={file.name}>
                                  {file.name}
                                </p>
                                <p className="text-[9px] text-slate-400 font-mono mt-0.5">
                                  {file.size} • Uploaded {file.uploadedAt}
                                </p>
                              </div>
                            </div>
                            <button 
                              onClick={() => deleteAttachment(selectedItem.id, file.id)}
                              className="text-slate-450 hover:text-red-500 p-1.5 shrink-0 transition-colors"
                              title="Delete physical attachment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-450 mt-3 text-center italic">
                        No encrypted physical copies (Medical Cert, Birth Cert, OR/CR) archived for this asset yet.
                      </p>
                    )}
                  </div>

                </div>

                {/* STEPS RUNBOOK & SLA FEEDBACK TELEMETRY (5 OF 12 COLS) */}
                <div className="lg:col-span-5 p-4 lg:p-6 flex flex-col gap-6 bg-slate-50/20">
                  
                  {/* RUNBOOK STEPS */}
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600 animate-spin-slow" />
                      Procedural SRE Runbook Instructions
                    </h4>
                    <div className="bg-slate-900 text-slate-100 rounded-xl p-4 max-h-[190px] overflow-y-auto text-[11px] space-y-2.5 font-mono shadow-md">
                      {selectedItem.runbookSteps.map((step, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
                          <p className="leading-relaxed text-slate-200">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SRE AGENCY SURVIVAL GUIDE */}
                  {selectedItem.survivalTips && selectedItem.survivalTips.length > 0 && (
                    <div className="bg-amber-500/10 border border-amber-300 text-amber-900 rounded-xl p-4">
                      <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                        <BookOpen className="w-4 h-4" />
                        SRE Agency Survival Guide
                      </h4>
                      <div className="space-y-2.5 text-[11px] overflow-y-auto max-h-[140px]">
                        {selectedItem.survivalTips.map((tip, idx) => (
                          <div key={idx} className="flex gap-2 items-start leading-snug">
                            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-amber-950 font-sans">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CROWDSOURCED REALTIME LATENCY */}
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                          Crowdsourced Latency Uptime
                        </h4>
                        <p className="text-[9px] text-slate-400 font-medium">Citizen processing speed averages</p>
                      </div>
                      <span className="text-indigo-600 font-extrabold font-mono text-[12px] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        ~{selectedItem.slaDays >= 1 ? `${selectedItem.slaDays} Days` : `${Math.round(selectedItem.slaDays * 24)} Hours`}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="bg-indigo-600 h-full transition-all" 
                        style={{ width: `${Math.min(100, Math.max(10, selectedItem.slaDays * 6))}%` }}
                      ></div>
                    </div>

                    <div className="text-[10px] text-slate-550 mt-2 flex justify-between font-mono font-medium">
                      <span>Fee Target: ₱{selectedItem.averageCostPhp.toLocaleString()}</span>
                      <span>Gate: {selectedItem.portalName}</span>
                    </div>

                    <form onSubmit={handleSubmitSlaCrowdsource} className="mt-3.5 pt-3 border-t border-slate-100">
                      <p className="text-[10px] font-black text-slate-700 uppercase mb-2 font-mono tracking-tight">
                        Contribute Local Agency Speed
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input 
                          id="contrib-days-input"
                          type="number"
                          step="any"
                          required
                          placeholder="Days (e.g. 0.5, 3)"
                          value={submitTimeDays}
                          onChange={(e) => setSubmitTimeDays(e.target.value)}
                          className="px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <input 
                          id="contrib-branch-input"
                          type="text"
                          placeholder="Agency Branch"
                          value={submitTimeBranch}
                          onChange={(e) => setSubmitTimeBranch(e.target.value)}
                          className="px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <button 
                        id="contrib-submit-btn"
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] py-2 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-colors"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        COLLATE MY SLA
                      </button>
                    </form>
                  </div>

                </div>

              </div>

              {/* SIMULATED PUSH ALERTS SIMULATOR TRIGGERS */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-indigo-600 animate-bounce" />
                    Push Alerts SRE Emitting Routine webhook simulations
                  </h4>
                  <p className="text-[10px] text-slate-550 font-medium">
                    This personal compliance engine flags notifications at 60, 30, and 7 days out. Test webhook hooks directly:
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <button 
                    id="btn-test-60d"
                    onClick={() => triggerSimulateAlert(60, selectedItem.name, selectedItem.id)}
                    className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] rounded transition-colors shadow-xs"
                  >
                    TEST 60d
                  </button>
                  <button 
                    id="btn-test-30d"
                    onClick={() => triggerSimulateAlert(30, selectedItem.name, selectedItem.id)}
                    className="px-3 py-2 bg-amber-50 border border-amber-250 hover:bg-amber-100 text-amber-800 font-bold text-[10px] rounded transition-colors shadow-xs"
                  >
                    TEST 30d
                  </button>
                  <button 
                    id="btn-test-7d"
                    onClick={() => triggerSimulateAlert(7, selectedItem.name, selectedItem.id)}
                    className="px-3 py-2 bg-red-50 border border-red-200 hover:bg-red-100 text-red-800 font-bold text-[10px] rounded transition-colors shadow-xs"
                  >
                    TEST 7d
                  </button>
                </div>
              </div>

            </section>
          ) : (
            <div className="text-center py-16 px-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center">
              <Shield className="w-16 h-16 text-indigo-100 mb-3" />
              <p className="font-extrabold text-sm uppercase text-slate-800">No Citizen Node Active</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">Please select an item from the catalog directory above to access documents, upload PDF certificates, and edit required renewal routines.</p>
            </div>
          )}

          {/* REALTIME EVENT COMPLIANCE STREAM CONSOLE */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg p-4 font-mono text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                PH Life Admin Compliance Telemetry Log Stream
              </span>
              <button 
                id="clear-log-btn"
                onClick={() => setIncidents([])} 
                className="text-[9px] text-slate-450 hover:text-slate-300 font-black uppercase font-mono tracking-wider transition-colors"
              >
                Clear Log
              </button>
            </div>

            <div className="space-y-1.5 text-[11px] max-h-[140px] overflow-y-auto" id="telemetry-log-console">
              {incidents.map((inc) => (
                <div key={inc.id} className="flex items-start gap-1 leading-relaxed">
                  <span className="text-slate-500 font-mono">[{inc.timestamp}]</span>
                  <span className={`font-black tracking-tight shrink-0 font-mono ${
                    inc.level === 'CRITICAL' ? 'text-red-400' : 
                    inc.level === 'WARNING' ? 'text-amber-400' : 
                    inc.level === 'SUCCESS' ? 'text-emerald-400' : 'text-indigo-400'
                  }`}>
                    {inc.level}:
                  </span>
                  <span className="text-slate-300 pl-1 font-mono">{inc.message}</span>
                </div>
              ))}
              
              <div className="flex items-start gap-1 text-[11px] text-slate-500 font-mono">
                <span>[{new Date().toTimeString().split(' ')[0]}]</span>
                <span className="font-bold">HEARTBEAT:</span>
                <span className="text-slate-500">Active citizen compliance cron healthy. 0 packets dropped. Local DB synced.</span>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* NEW ASSET RECORD INITIATION MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="add-tracking-modal">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh] transform transition-transform" id="tracking-modal">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <h3 className="font-extrabold text-sm uppercase tracking-wide text-white">Initiate New Bureaucracy Pipeline</h3>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">Schedule triggers to monitor physical or digital certifications</p>
              </div>
              <button 
                id="close-modal-btn"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateItemSubmit} className="p-5 overflow-y-auto flex-1 space-y-4">
              
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-705 mb-1">Document / License Name</label>
                <input 
                  id="modal-input-name"
                  type="text"
                  required
                  placeholder="e.g. Barangay Clearance, Pag-IBIG Member ID, Quezon City Business Tax"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-705 mb-1">Tracking Code / Plate Ref</label>
                  <input 
                    id="modal-input-code"
                    type="text"
                    required
                    placeholder="e.g. plate LTR-419, T-2039-X"
                    value={newItemCode}
                    onChange={(e) => setNewItemCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-705 mb-1">Bureau Category</label>
                  <select 
                    id="modal-select-category"
                    value={newItemCat}
                    onChange={(e) => setNewItemCat(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-255 rounded-lg text-xs font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Identity">Identity</option>
                    <option value="Transport">Transport</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Residency">Residency</option>
                    <option value="Travel">Travel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-705 mb-1">Next Expiration Date</label>
                  <input 
                    id="modal-input-expiry"
                    type="date"
                    value={newItemNext}
                    onChange={(e) => setNewItemNext(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <span className="text-[9px] text-slate-400 italic font-medium font-mono">Defaults to 90 days from today if blank</span>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-705 mb-1">Renewal Cadence</label>
                  <select 
                    id="modal-select-cycle"
                    value={newItemCycle}
                    onChange={(e) => setNewItemCycle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-255 rounded-lg text-xs font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Annual">Annual</option>
                    <option value="3 Years">3 Years</option>
                    <option value="5 Years">5 Years</option>
                    <option value="10 Years">10 Years</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="One-Time Stamp">One-Time Stamp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-705 mb-1">Portal Name</label>
                  <input 
                    id="modal-input-portal-name"
                    type="text"
                    placeholder="e.g. PhilSys ID Tracker"
                    value={newItemPortalName}
                    onChange={(e) => setNewItemPortalName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold bg-slate-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-705 mb-1">Portal URL Link</label>
                  <input 
                    id="modal-input-portal-url"
                    type="url"
                    placeholder="https://..."
                    value={newItemPortalUrl}
                    onChange={(e) => setNewItemPortalUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold bg-slate-50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-705 mb-1">Baseline SLA Days (Gov Speed)</label>
                  <input 
                    id="modal-input-sla"
                    type="number"
                    step="any"
                    placeholder="e.g. 1, 12, 0.5"
                    value={newItemSla}
                    onChange={(e) => setNewItemSla(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-255 rounded-lg text-xs font-semibold bg-slate-50 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase text-slate-705 mb-1">Average Cost (PHP)</label>
                  <input 
                    id="modal-input-cost"
                    type="number"
                    placeholder="e.g. 1500"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold bg-slate-50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-705 mb-1">Runbook Steps (Newline separated)</label>
                <textarea 
                  id="modal-textarea-runbook"
                  rows={3}
                  placeholder="Step 1: Authenticate digital signature&#10;Step 2: Sign-in onto client portal&#10;Step 3: Transfer processing fees"
                  value={newRunbookText}
                  onChange={(e) => setNewRunbookText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-250 rounded-lg text-xs font-semibold bg-slate-50 focus:outline-none font-mono"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-200">
                <button 
                  id="modal-cancel-btn"
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-655 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  id="modal-submit-btn"
                  type="submit" 
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 bg-indigo-600 text-white rounded-lg text-xs font-black shadow-md transition-shadow"
                >
                  START TRACKING
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* FOOTER BAR */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 text-white flex items-center px-4 lg:px-8 justify-between shrink-0 text-[10px] mt-auto font-medium tracking-wide">
        <div className="flex gap-4 sm:gap-6 items-center uppercase text-[9px] lg:text-[10px]">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            STANDBY LOCAL SYNC
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            PING MONITORING: ACTIVE
          </div>
        </div>
        <div className="opacity-60 font-mono text-[9px] lg:text-[10px] hidden md:block">
          POLLING TELEMETRY SEQUENCE ACTIVE STATUS_HEALTHY
        </div>
      </footer>

    </div>
  );
}
