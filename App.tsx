
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import FarmMap from './components/FarmMap';
import DetailCard from './components/DetailCard';
import AIConcierge from './components/AIConcierge';
import { FARMS as INITIAL_FARMS } from './data/Components';
import { Farm, Category } from './types';
import { Menu, X, Sparkles, Moon, Sun, Globe, FileUp, Lock, RotateCcw, Code, ClipboardCheck } from 'lucide-react';
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'terrefvg_farms_data';

const LogoTerreFVG = ({ onClick }: { onClick: () => void }) => (
  <div className="flex items-center group cursor-pointer select-none" onClick={onClick}>
    <div className="relative h-10 md:h-12 transition-transform duration-500 ease-out group-hover:scale-[1.02]">
      <svg id="Livello_1" data-name="Livello 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 254.17 113.39" className="h-full w-auto text-[#605045] dark:text-white transition-colors duration-500">
        <path fill="currentColor" d="m87.79,27.2c1.34.1,2.69.18,4.03.24,1.12,0,2.23.03,3.37.03,4.32-.02,8.74-.23,13.16-.86,4.42-.61,8.82-1.68,13.06-3.19,2.11-.77,4.2-1.6,6.22-2.59,1.02-.46,2-1,2.99-1.52.97-.56,1.95-1.08,2.9-1.67,3.8-2.33,7.35-4.99,10.6-7.94,3.25-2.96,6.25-6.15,8.84-9.69-3.84,2.12-7.52,4.3-11.24,6.32-3.72,2.02-7.45,3.91-11.22,5.58-3.76,1.71-7.6,3.13-11.47,4.36-3.89,1.19-7.84,2.15-11.88,2.88-2.02.38-4.06.67-6.12.98-2.06.28-4.15.56-6.26.82-2.11.28-4.25.55-6.4.91-1.07.17-2.15.29-3.22.45-1.08.17-2.15.34-3.23.52-3.12.55-6.26,1.25-9.31,2.23,5.07.99,10.14,1.76,15.2,2.14"/>
        <path fill="currentColor" d="m10.06,25.06c1.56-.74,3.08-1.55,4.7-2.22,1.62-.68,3.3-1.24,5.04-1.67,3.47-.88,7.08-1.18,10.67-1.13,1.8,0,3.58.15,5.36.34,1.78.17,3.54.47,5.3.79,3.5.65,6.93,1.58,10.31,2.62.84.27,1.68.54,2.52.83l2.46.85,4.76,1.63c1.59.53,3.18,1.05,4.77,1.54,1.59.5,3.17,1,4.76,1.45,6.36,1.83,12.74,3.35,19.15,4.26,3.2.45,6.41.8,9.62.93,3.21.16,6.42.15,9.62-.05,6.42-.34,12.8-1.46,19.13-3.12,6.33-1.67,12.59-3.95,18.8-6.56,1.55-.65,3.1-1.33,4.64-2.03,1.55-.68,3.08-1.41,4.63-2.13,3.09-1.46,6.16-2.98,9.29-4.47-2.43,2.48-5.01,4.79-7.69,7-2.68,2.21-5.47,4.29-8.36,6.26-5.8,3.91-12.04,7.29-18.68,9.9-6.63,2.63-13.7,4.39-20.9,5.21-1.8.21-3.61.32-5.42.4-1.81.08-3.62.11-5.43.05-1.81-.05-3.61-.16-5.41-.32-1.8-.16-3.59-.35-5.37-.63-7.12-1.07-14.03-2.91-20.66-5.28-1.66-.59-3.3-1.21-4.94-1.85-1.62-.66-3.24-1.34-4.84-2.03l-2.39-1.06-2.36-1.11-2.29-1.08c-.75-.36-1.51-.69-2.26-1.02-6.03-2.71-12.22-5.03-18.64-6.36-3.21-.67-6.47-1.06-9.78-1.04-1.65.02-3.32.12-5,.34-1.68.19-3.38.55-5.1.75"/>
        <path fill="currentColor" d="m1.66,37.7c-.81-.83-1.33-1.9-1.57-3.12-.23-1.21-.07-2.68.71-3.96.77-1.28,2.03-2.19,3.25-2.71.62-.26,1.25-.46,1.86-.58.31-.07.61-.12.92-.16l.44-.05.38-.04c2.04-.19,4.08-.21,6.09-.09,1.01.07,1.99.15,2.96.23.98.08,1.9.1,3.07-.13-.41,1.1-1.41,1.99-2.42,2.57-1.02.6-2.08.99-3.11,1.31-2.08.62-4.14.92-6.2,1.05-1.9.09-3.25.27-4.27.94-.52.33-1,.92-1.35,1.76-.36.83-.59,1.84-.76,2.96"/>
        <path fill="currentColor" d="m42.85,86.89h24.34v9.24c-.19.24-.36.65-.7,1.17-1.5,2.25-5.54,4.41-9.29,4.41-9.57,0-14.26-6.85-14.35-14.82m8.25-16.04c5.54,0,6.29,9.29,6.29,15.2h-14.54c0-6.85.94-15.2,8.25-15.2m82.32,0c5.53,0,6.28,9.29,6.28,15.2h-14.54c0-6.85.94-15.2,8.26-15.2m16.51,25.05c-.47,0-.56.56-1.12,1.41-1.5,2.25-5.54,4.41-9.29,4.41-9.57,0-14.26-6.85-14.35-14.82h24.95c0-8.44-7.51-16.7-16.7-16.7-3.41,0-6.91,1.11-9.99,3.07.65-1.28.96-2.85.96-4.38,0-3.47-2.72-6.47-6.19-6.47-5.35,0-8.63,6.75-9.94,9.38v-9.57h-.56s-7,3.35-13.99,4.79c-1.12-1.56-2.9-2.6-4.94-2.6-5.35,0-8.63,6.75-9.94,9.38v-9.57h-.56s-9.01,4.32-16.79,5.25v.66c1.41.84,5.72,3.38,5.72,6.29v6.28c-1.96-6.78-8.44-12.5-16.09-12.5-9.57,0-19.79,8.72-19.79,20.26,0,4.8,1.6,9.03,4.28,12.33-.93.74-2.13,1.27-3.69,1.27-3.85,0-6.1-4.41-6.1-7.88v-25.48h9.29l1.31-3.56h-10.6v-11.82h-.56l-14.73,14.82v.56h3.56v25.01c0,8.16,5.72,11.82,12.38,11.82,3.9,0,7.45-1.74,9.62-4.16,3.78,4.3,9.47,6.88,15.88,6.88,5.06,0,9.49-2.83,12.48-6.44h19.37v-.75c-3.94,0-4.97-1.78-4.97-6.19v-18.1c0-2.53,1.59-5.44,3.38-5.44,2.53,0,3.1,4.6,7.79,4.6,3.39,0,4.89-3.48,4.96-6.79.95.97,1.68,2.1,1.68,3.29v22.45c0,4.41-1.03,6.19-4.97,6.19v.75h21.58v-.75c-3.94,0-4.97-1.78-4.97-6.19v-20.1c0-2.53,1.6-5.44,3.38-5.44,2.53,0,3.1,4.6,7.79,4.6.23,0,.44-.02.65-.05-3.83,3.63-6.45,8.75-6.45,14.58,0,11.54,9.19,19.79,20.64,19.79,8.25,0,14.82-7.5,16.23-13.69,0-.28-.09-.66-.56-.66"/>
        <path fill="currentColor" d="m37.92,49.14h-.01c-1.15-.88-2.28-1.82-3.39-2.81-1.14-1.02-2.26-2.1-3.39-3.22l-.86-.86-.95-.93c-.64-.61-1.32-1.2-2-1.77-2.73-2.28-5.83-4.33-9.37-5.49-.88-.28-1.78-.51-2.69-.66-.92-.14-1.84-.22-2.75-.19-1.83.03-3.6.47-5.15,1.24,1.71.25,3.29.66,4.7,1.29.71.32,1.39.66,2.03,1.07.65.39,1.26.83,1.86,1.29,2.37,1.85,4.43,4.11,6.37,6.52.48.6.95,1.23,1.42,1.84l.7.94.78,1.02c1.06,1.37,2.2,2.72,3.43,4.03,2.46,2.61,5.34,4.99,8.53,6.86,3.19,1.88,6.63,3.24,10.11,4.12,3.48.9,6.98,1.3,10.45,1.43,3.46.09,6.88-.11,10.26-.58,1.69-.24,3.36-.54,5.02-.92,1.66-.37,3.3-.82,4.93-1.37-19.19-2.47-31.52-6.05-40-12.86"/>
        <path fill="currentColor" d="m130.3,58.09v-5.58c-.27-.38-.57-.65-.91-.82-.34-.17-.73-.26-1.18-.26-.81,0-1.43.28-1.86.84-.43.56-.64,1.47-.64,2.73s.23,2.25.67,2.96c.45.71,1.04,1.07,1.78,1.07s1.46-.32,2.14-.95m3.69.27s.09.04.12.11c.04.08.04.12.01.13l-3.11,1.51-.11.02c-.14,0-.26-.14-.37-.43-.11-.29-.18-.67-.21-1.17-1.11,1.05-2.24,1.58-3.4,1.58-.66,0-1.26-.17-1.79-.52-.53-.35-.96-.85-1.27-1.52s-.47-1.45-.47-2.35c0-1.14.27-2.07.8-2.8.53-.73,1.19-1.26,1.98-1.59.79-.33,1.58-.49,2.38-.49.55,0,1.14.09,1.76.27v-4.55c0-.53-.05-.9-.15-1.12-.1-.23-.27-.34-.51-.34-.19,0-.47.08-.83.25h-.02c-.06,0-.11-.04-.15-.12-.04-.08-.04-.13-.01-.15l3.31-1.55.09-.02c.07,0,.16.03.25.1.09.07.14.13.14.19v13.42c0,.51.05.87.15,1.08.1.21.26.32.48.32.2,0,.5-.08.92-.25h.02Z"/>
        <path fill="currentColor" d="m137.86,52.03c-.33.43-.55,1.02-.65,1.77l3.26-.05c-.01-.77-.13-1.35-.34-1.76-.21-.4-.56-.61-1.04-.61s-.91.21-1.24.64m5.02,6.31s.06.03.1.09.04.1.01.13c-.56.54-1.12.93-1.69,1.17-.57.24-1.19.36-1.87.36-.95,0-1.76-.2-2.45-.6-.69-.4-1.22-.93-1.58-1.6-.36-.67-.54-1.39-.54-2.17,0-.87.22-1.67.65-2.41.44-.74,1.04-1.32,1.81-1.74.77-.43,1.65-.64,2.62-.64s1.65.21,2.16.63c.51.42.77,1.07.77,1.96,0,.46-.08.7-.25.7l-5.47.02c-.02.1-.02.28-.02.52,0,1.32.3,2.35.91,3.11.61.75,1.48,1.12,2.62,1.12.41,0,.75-.05,1.04-.14.29-.09.66-.26,1.12-.49l.05-.02Z"/>
        <path fill="currentColor" d="m144.3,59.69c0-.09.01-.13.04-.13.46,0,.78-.11.96-.33.17-.22.26-.63.26-1.23l.02-11.43c0-.52-.05-.9-.15-1.12-.1-.23-.27-.34-.51-.34-.19,0-.48.08-.85.25h-.02s-.09-.04-.12-.12c-.04-.08-.04-.13-.01-.15l3.31-1.55.09-.02c.07,0,.16.03.25.1.09.07.14.13.14.19v14.2c0,.6.08,1.01.25,1.23.17.22.48.33.95.33.06,0,.09.04.09.13s-.03.14-.09.14c-.38,0-.67,0-.9-.02l-1.37-.02-1.35.02c-.23.02-.53.02-.92.02-.03,0-.04-.04-.04-.14"/>
        <path fill="currentColor" d="m168.96,37.49c.7.35,1.05.84,1.05,1.47,0,.52-.17.92-.52,1.21-.35.29-.75.44-1.2.44-.54,0-.93-.12-1.18-.37-.25-.25-.47-.61-.68-1.08-.2-.47-.42-.83-.64-1.06-.23-.24-.58-.35-1.08-.35-1.03,0-1.85.72-2.45,2.16-.6,1.44-.89,2.58-.89,5.64v1.51c.7-.02,1.93-.12,3.71-.3.07,0,.12.08.17.25.05.17.07.35.07.56,0,.23-.04.45-.12.66-.08.21-.15.31-.22.29-1.08-.27-2.28-.44-3.61-.51v9.07c0,.7.07,1.2.2,1.52.14.32.41.53.83.64.42.11,1.07.17,1.97.17.09,0,.13.07.13.2s-.04.2-.13.2l-2.33-.03c-.52-.02-1.28-.03-2.29-.03l-2.06.03c-.36.02-.86.03-1.52.03-.09,0-.13-.07-.13-.2s.04-.2.13-.2c.59,0,1.02-.06,1.3-.17.28-.11.47-.33.57-.66.1-.33.15-.83.15-1.5v-7.59c0-.7-.15-1.15-.44-1.37-.29-.21-.87-.32-1.72-.32-.07,0-.1-.1-.1-.3s.03-.3.1-.3c.79,0,1.33-.11,1.62-.32.29-.21.45-.05.47-.61.11-3.67.81-5.21,2.09-6.84,1.28-1.63,3.21-2.44,5.8-2.44,1.26,0,2.24.17,2.93.52"/>
        <path fill="currentColor" d="m177.14,47c.48.37.72.82.72,1.33,0,.47-.15.86-.44,1.16-.29.3-.67.46-1.15.46-.34,0-.61-.07-.83-.2-.21-.14-.43-.34-.66-.61-.2-.22-.38-.39-.52-.49-.15-.1-.32-.15-.52-.15-.23,0-.47.09-.73.25-.26.17-.66.52-1.2,1.06v7.25c0,.9.21,1.51.64,1.84s1.21.49,2.36.49c.09,0,.13.07.13.2s-.04.2-.13.2c-.79,0-1.41-.01-1.86-.03l-2.73-.03-1.99.03c-.34.02-.8.03-1.38.03-.07,0-.1-.07-.1-.2s.03-.2.1-.2c.7,0,1.17-.16,1.42-.49.25-.33.37-.94.37-1.84v-6.34c0-.7-.09-1.21-.25-1.54-.17-.33-.43-.49-.79-.49-.38,0-.92.16-1.62.47h-.07c-.07,0-.12-.06-.15-.17-.03-.11-.03-.18.02-.2l4.69-2.29c.14-.05.21-.07.24-.07.25,0,.48.24.71.73.22.48.36,1.14.4,1.97,1.55-1.84,3.26-2.77,5.13-2.77,1.21,0,2.18.39,2.88,1.16.71.78,1.06,1.79,1.06,3.05v7.25c0,.9.21,1.51.64,1.84s1.21.49,2.36.49c.09,0,.13.07.13.2"/>
        <path fill="currentColor" d="m181.37,44.34c-.36-.36-.54-.87-.54-1.52,0-.59.18-1.05.56-1.4.37-.35.87-.52,1.5-.52s1.11.17,1.45.51c.34.34.51.81.51,1.42,0,.65-.17,1.16-.51,1.52-.34.36-.82.54-1.45.54s-1.16-.18-1.52-.54m-1.82,15.26c0-.13.03-.2.1-.2.7,0,1.17-.16,1.42-.49.25-.33.37-.94.37-1.84v-6.04c0-.76-.08-1.32-.24-1.65-.16-.34-.42-.51-.78-.51-.29,0-.71.12-1.25.37h-.03c-.09,0-.16-.06-.2-.18-.04-.12-.03-.2.03-.22l5.09-2.36.1-.03c.11,0,.23.06.34.17s.17.22.17.3v.74c-.05.9-.07,2-.07,3.31v6.1c0,.9.13,1.51.39,1.84.26.33.74.49,1.43.49.07,0,.1.07.1.2s-.03.2-.1.2c-.58,0-1.04-.01-1.38-.03l-2.02-.03-1.99.03c-.34.02-.8.03-1.38.03-.07,0-.1-.07-.1-.2"/>
        <path fill="currentColor" d="m204.04,57.61c.07,0,.13.06.18.17.06.11.05.18-.02.2l-4.66,2.26s-.1.04-.17.04c-.22,0-.42-.24-.59-.73-.17-.48-.26-1.14-.29-1.97-1.48,1.75-3.09,2.63-4.82,2.63-1.24,0-2.21-.39-2.92-1.16-.71-.78-1.06-1.79-1.06-3.05v-4.96c0-1.46-.35-2.19-1.04-2.19-.25,0-.53.08-.84.24h-.03c-.09,0-.16-.06-.2-.19-.04-.12-.03-.2.03-.22l4.52-2.16.17-.03c.11,0,.23.05.36.15.12.1.18.2.18.29v7.46c0,2.43.93,3.64,2.8,3.64.49,0,.99-.11,1.5-.32.51-.21.96-.51,1.37-.89v-5.77c0-1.46-.35-2.19-1.05-2.19-.25,0-.54.08-.88.24h-.03c-.07,0-.12-.06-.17-.19-.05-.12-.03-.2.03-.22l4.52-2.16s.1-.03.17-.03c.11,0,.23.05.35.15.12.1.19.2.19.29v8.97c0,.76.07,1.3,.22,1.62.15.32.39.47.73.47.32,0,.78-.12,1.38-.37h.07Z"/>
        <path fill="currentColor" d="m205.36,59.6c0-.13.02-.2.07-.2.7,0,1.17-.16,1.43-.49.26-.33.39-.94.39-1.84l.03-14.19c0-.79-.07-1.35-.22-1.69-.15-.34-.4-.51-.76-.51-.29,0-.72.12-1.28.37h-.03c-.07,0-.13-.06-.19-.19-.06-.12-.06-.2-.02-.22l4.96-2.33.14-.03c.11,0,.24.05.37.15.13.1.2.2.2.29v18.34c0,.9.12,1.51.37,1.84.25.33.72.49,1.42.49.09,0,.14.07.14.2s-.05.2-.14.2c-.56,0-1.01-.01-1.35-.03l-2.06-.03-2.02.03c-.34.02-.8.03-1.38.03-.05,0-.07-.07-.07-.2"/>
        <path fill="currentColor" d="m216.32,44.34c-.36-.36-.54-.87-.54-1.52,0-.59.18-1.05.56-1.4s.87-.52,1.5-.52,1.11.17,1.45.51c.34.34.51.81.51,1.42,0,.65-.17,1.16-.51,1.52-.34.36-.82.54-1.45.54s-1.16-.18-1.52-.54m-1.82,15.26c0-.13.03-.2.1-.2.7,0,1.17-.16,1.42-.49.25-.33.37-.94.37-1.84v-6.04c0-.76-.08-1.32-.24-1.65-.16-.34-.42-.51-.78-.51-.29,0-.71.12-1.25.37h-.03c-.09,0-.16-.06-.2-.18-.04-.12-.03-.2.03-.22l5.09-2.36.1-.03c.11,0,.22.06.34.17.11.11.17.22.17.3v.74c-.05.9-.07,2-.07,3.31v6.1c0,.9.13,1.51.39,1.84.26.33.74.49,1.43.49.07,0,.1.07.1.2s-.03.2-.1.2c-.58,0-1.05-.01-1.38-.03l-2.02-.03-1.99.03c-.34.02-.8.03-1.38.03-.07,0-.1-.07-.1-.2"/>
        <path fill="currentColor" d="m171.91,68.02c0,.14-.02.2-.07.2-.65,0-1.23.25-1.74.74-.51.5-.98,1.26-1.43,2.29l-4.15,9.58c-.02.11-.15.17-.37.17-.18,0-.3-.06-.37-.17l-5.16-10.22c-.47-.99-.89-1.64-1.25-1.94-.36-.3-.8-.46-1.32-.46-.07,0-.1-.07-.1-.2s.03-.2.1-.2c.4,0,.74.01,1.01.03l2.26.03,2.6-.03c.38-.02.91-.03,1.58-.03.07,0,.1.07.1.2s-.03.2-.1.2c-1.3,0-1.96.26-1.96.78,0,.13.05.32.17.54l3.78,7.08,2.23-5.4c.18-.47.27-.88.27-1.21,0-.56-.19-1-.57-1.32-.38-.32-.91-.47-1.59-.47-.04,0-.07-.07-.07-.2s.02-.2.07-.2c.61,0,1.07.01,1.38.03l2.02.03,1.35-.03c.27-.02.68-.03,1.25-.03.05,0,.07.07.07.2"/>
        <path fill="currentColor" d="m176.93,69.15c-.5.64-.82,1.52-.98,2.65l4.89-.07c-.02-1.15-.19-2.02-.51-2.63s-.83-.91-1.55-.91-1.36.32-1.85.96m7.52,9.46s.1.05.15.14.06.16.02.2c-.83.81-1.68,1.4-2.53,1.75-.85.36-1.79.54-2.8.54-1.42,0-2.64-.3-3.68-.89-1.04-.6-1.82-1.39-2.36-2.4-.54-1-.81-2.08-.81-3.26,0-1.3.33-2.51.98-3.61.65-1.1,1.56-1.97,2.72-2.61,1.16-.64,2.47-.96,3.93-.96s2.47.32,3.24.95c.76.63,1.15,1.61,1.15,2.93,0,.7-.12,1.05-.37,1.05l-8.2.03c-.02.16-.03.42-.03.78,0,1.98.45,3.53,1.37,4.65.91,1.12,2.22,1.69,3.93,1.69.61,0,1.12-.07,1.55-.2.43-.13.99-.38,1.69-.74l.07-.03!"/>
        <path fill="currentColor" d="m202.74,80.63c0,.14-.03.2-.1.2-.58,0-1.05-.01-1.38-.03l-2.02-.03-1.96.03c-.36.02-.83.03-1.42.03-.07,0-.1-.07-.1-.2s.03-.2.1-.2c.7,0,1.17-.16,1.42-.49.25-.33.37-.94.37-1.84v-4.86c0-1.21-.22-2.11-.66-2.7-.44-.58-1.13-.88-2.08-.88-.54,0-1.1.11-1.67.34-.57.23-1.07.53-1.5.91v7.18c0,.9.13,1.51.39,1.84.26.33.74.49,1.43.49.07,0,.1.07.1.2s-.03.2-.1.2c-.59,0-1.05-.01-1.38-.03l-2.02-.03-1.99.03c-.34.02-.8.03-1.38.03-.07,0-.1-.07-.1-.2s.03-.2.1-.2c.7,0,1.17-.16,1.42-.49.25-.33.37-.94.37-1.84v-6.34c0-.7-.08-1.21-.25-1.54-.17-.33-.43-.49-.79-.49-.38,0-.92.16-1.62.47h-.07c-.07,0-.12-.06-.15-.17-.03-.11-.03-.18.02-.2l4.69-2.29c.14-.04.21-.07.24-.07.25,0,.48.24.71.73.22.48.36,1.14.4,1.97,1.55-1.84,3.26-2.77,5.13-2.77,1.21,0,2.18.39,2.88,1.16.71.78,1.06,1.79,1.06,3.05v6.48c0,.9.13,1.51.39,1.84.26.33.74.49,1.43.49.07,0,.1.07.1.2"/>
        <path fill="currentColor" d="m208.78,69.15c-.5.64-.82,1.52-.98,2.65l4.89-.07c-.02-1.15-.19-2.02-.51-2.63s-.83-.91-1.55-.91-1.36.32-1.85.96m7.52,9.46s.1.05.15.14.06.16.02.2c-.83.81-1.68,1.4-2.53,1.75-.85.36-1.79.54-2.8.54-1.42,0-2.64-.3-3.68-.89-1.04-.6-1.82-1.39-2.36-2.4-.54-1-.81-2.08-.81-3.26,0-1.3.33-2.51.98-3.61.65-1.1,1.56-1.97,2.72-2.61,1.16-.64,2.47-.96,3.93-.96s2.47.32,3.24.95c.76.63,1.15,1.61,1.15,2.93,0,.7-.12,1.05-.37,1.05l-8.2.03c-.02.16-.03.42-.03.78,0,1.98.46,3.53,1.37,4.65.91,1.12,2.22,1.69,3.93,1.69.61,0,1.12-.07,1.55-.2.43-.13.99-.38,1.69-.74l.07-.03Z"/>
        <path fill="currentColor" d="m225.94,68.55c.09-.16.03-.24-.17-.24-1.84,0-3.37.3-4.59.89s-2.02,1.49-2.43,2.68c0,.02-.04.03-.13.03-.18,0-.26-.05-.24-.14l1.42-5.3s.04-.03.14-.03c.18,0,.26.04.24.13-.05.18-.07.32-.07.4,0,.32.14.53.4.64.27.11.72.17,1.35.17h7.76c.09,0,.17.04.24.13s.08.18.03.27l-7.69,11.77c-.07.16-.01.24.17.24,2.2,0,3.9-.32,5.09-.95,1.19-.63,1.93-1.6,2.23-2.9.02-.07.1-.1.22-.1s.19.03.19.1l-.07,4.08c0,.09-.03.17-.1.25-.07.08-.15.12-.24.12h-11.03c-.09,0-.16-.05-.22-.14-.06-.09-.06-.18-.02-.27l7.52-11.87Z"/>
        <path fill="currentColor" d="m234.01,65.37c-.36-.36-.54-.87-.54-1.52,0-.59.18-1.05.56-1.4.37-.35.87-.52,1.5-.52s1.11.17,1.45.51c.34.34.51.81.51,1.42,0,.65-.17,1.16-.51,1.52-.34.36-.82.54-1.45.54s-1.16-.18-1.52-.54m-1.82,15.26c0-.13.03-.2.1-.2.7,0,1.17-.16,1.42-.49.25-.33.37-.94.37-1.84v-6.04c0-.76-.08-1.32-.24-1.65-.16-.34-.42-.51-.78-.51-.29,0-.71.12-1.25.37h-.03c-.09,0-.16-.06-.2-.18-.04-.12-.03-.2.03-.22l5.09-2.36.1-.03c.11,0,.22.06.34.17.11.11.17.22.17.3v.74c-.05.9-.07,2-.07,3.31v6.1c0,.9.13,1.51.39,1.84.26.33.74.49,1.43.49.07,0,.1.07.1.2s-.03.2-.1.2c-.58,0-1.04-.01-1.38-.03l-2.02-.03-1.99.03c-.34.02-.8.03-1.38.03-.07,0-.1-.07-.1-.2"/>
        <path fill="currentColor" d="m248.48,78.4c-.02-.09-.03-.24-.03-.44v-3.24l-1.45.68c-.07.02-.29.11-.67.25-.38.15-.71.39-.99.73-.28.34-.42.73-.42,1.18,0,.54.17.96.52,1.26.35.3.75.46,1.2.46.36,0,.73-.12,1.11-.37l.74-.51Zm5.5.61c.09,0,.15.05.19.15.03.1,0,.18-.09.22l-3.47,1.65c-.09.04-.2.07-.34.07-.36,0-.7-.19-1.03-.57-.33-.38-.56-.9-.69-1.55l-1.45,1.01c-.52.38-1,.66-1.45.83-.45.17-.96.25-1.52.25-.97,0-1.7-.21-2.19-.64-.49-.43-.74-1.02-.74-1.79,0-.61.15-1.1.44-1.47.29-.37.66-.66,1.1-.88.44-.21,1.05-.46,1.84-.73l.84-.3,3.04-1.11v-1.92c0-1.44-.12-2.48-.35-3.14-.24-.65-.64-.98-1.2-.98-1.19,0-1.87.92-2.03,2.77-.07.67-.26,1.16-.59,1.45-.33.29-.78.44-1.37.44s-.97-.12-1.23-.35c-.26-.24-.39-.54-.39-.93,0-.68.39-1.32,1.18-1.94.79-.62,1.74-1.12,2.85-1.5,1.11-.38,2.1-.57,2.95-.57.99,0,1.79.31,2.41.93s.93,1.56.93,2.82v5.97c0,.65.12,1.16.35,1.52.24.36.57.54.99.54.31,0,.64-.08.98-.24h.03Z"/>
        <path fill="currentColor" d="m159.58,93.82c0,.95.14,1.79.4,2.55.27.75.62,1.34,1.06,1.77.44.43.9.64,1.4.64s.91-.25,1.25-.74c.34-.5.51-1.25.51-2.26s-.16-1.79-.47-2.48-.71-1.2-1.2-1.54c-.48-.34-.96-.51-1.43-.51-1.01,0-1.52.86-1.52,2.56m6.17,17.41c.67-.72,1.01-1.7,1.01-2.93,0-.97-.21-1.67-.62-2.11-.42-.44-.96-.71-1.62-.81-.66-.1-1.62-.16-2.89-.19-.2,0-.48-.01-.84-.03-.36-.02-.66-.05-.91-.07-.76.56-1.15,1.46-1.15,2.7,0,1.44.42,2.55,1.27,3.34.84.79,1.85,1.18,3.02,1.18s2.06-.36,2.73-1.08m.79-8.5c.84.14,1.55.47,2.12,1,.57.53.86,1.33.86,2.41,0,1.26-.39,2.44-1.16,3.56-.78,1.11-1.82,2.01-3.14,2.68-1.32.68-2.73,1.01-4.23,1.01s-2.82-.35-3.81-1.06c-.99-.71-1.48-1.64-1.48-2.78,0-1.57,1.14-3.1,3.41-4.59-1.62-.32-2.43-1.12-2.43-2.43,0-1.39.79-2.62,2.36-3.68-.85-.4-1.52-.97-2.01-1.7-.48-.73-.73-1.5-.73-2.31,0-.9.29-1.66.88-2.29.58-.63,1.33-1.11,2.24-1.43.91-.33,1.84-.49,2.78-.49,1.42,0,2.63.36,3.64,1.08,1.17-.79,2.38-1.18,3.64-1.18.18,0,.27.32.27.95,0,.34-.05.69-.14,1.06-.09.37-.18.52-.27.45-.92-.38-1.75-.57-2.5-.57h-.27c.61.72.91,1.53.91,2.43s-.29,1.7-.88,2.39c-.58.7-1.33,1.23-2.24,1.6-.91.37-1.85.56-2.82.56-.7,0-1.34-.1-1.92-.3-.36.38-.54.87-.54,1.45s.16,1.04.49,1.31c.33.27.76.44,1.3.51.54.07,1.34.11,2.4.13,1.33.02,2.41.1,3.26.24"/>
        <path fill="currentColor" d="m173.11,88.41c-.36-.36-.54-.87-.54-1.52,0-.59.18-1.05.56-1.4s.87-.52,1.5-.52,1.11.17,1.45.51.51.81.51,1.42,0,.65-.17,1.16-.51,1.52-.34.36-.82.54-1.45.54s-1.16-.18-1.52-.54m-1.82,15.26c0-.13.03-.2.1-.2.7,0,1.17-.16,1.42-.49.25-.33.37-.94.37-1.84v-604c0-.76-.08-1.32-.24-1.65-.16-.34-.42-.51-.78-.51-.29,0-.71.12-1.25.37h-.03c-.09,0-.16-.06-.2-.18-.05-.12-.03-.2.03-.22l5.09-2.36.1-.03c.11,0,.22.06.34.17.11.11.17.22.17.3v.74c-.05.9-.07,2-.07,3.31v6.1c0,.9.13,1.51.39,1.84.26.33.74.49,1.43.49.07,0,.1.07.1.2s-.03.2-.1.2c-.58,0-1.04-.01-1.38-.03l-2.02-.03-1.99.03c-.34.02-.8.03-1.38.03-.07,0-.1-.07-.1-.2"/>
        <path fill="currentColor" d="m195.77,101.68c.07,0,.13.06.19.17.06.11.05.18-.02.2l-4.65,2.26s-.1.03-.17.03c-.22,0-.42-.24-.59-.73-.17-.48-.26-1.14-.29-1.97-1.48,1.75-3.09,2.63-4.82,2.63-1.24,0-2.21-.39-2.92-1.16s-1.06-1.79-1.06-3.05v-4.96c0-1.46-.35-2.19-1.05-2.19-.25,0-.53.08-.84.24h-.03c-.09,0-.16-.06-.2-.19-.04-.12-.03-.2.03-.22l4.52-2.16.17-.03c.11,0,.23.05.35.15.12.1.18.2.18.29v7.45c0,2.43.93,3.64,2.8,3.64.49,0,.99-.11,1.5-.32.51-.21.96-.51,1.37-.89v-5.77c0-1.46-.35-2.19-1.05-2.19-.25,0-.54.08-.88.24h-.03c-.07,0-.12-.06-.17-.19-.05-.12-.03-.2.03-.22l4.52-2.16s.1-.03.17-.03c.11,0,.23.05.35.15.12.1.19.2.19.29v8.97c0,.76.07,1.31.22,1.62.15.32.39.47.73.47.31,0,.77-.12,1.38-.37h.07Z"/>
        <path fill="currentColor" d="m197.09,103.67c0-.13.02-.2.07-.2.7,0,1.17-.16,1.43-.49.26-.33.39-.94.39-1.84l.03-11.75c0-.79-.07-1.35-.22-1.69-.15-.34-.4-.51-.76-.51-.29,0-.72.12-1.28.37h-.03c-.07,0-.13-.06-.19-.19-.06-.12-.06-.2-.02-.22l4.96-2.33.14-.03c.11,0,.24.05.37.15.13.1.2.2.2.29v15.9c0,.9.12,1.51.37,1.84s.72.49,1.42.49c.09,0,.14.07.14.2s-.05.2-.14.2c-.56,0-1.01-.01-1.35-.03l-2.06-.03-2.02.03c-.34.02-.8.03-1.38.03-.05,0-.07-.07-.07-.2"/>
        <path fill="currentColor" d="m208.05,88.41c-.36-.36-.54-.87-.54-1.52,0-.59.18-1.05.56-1.4s.87-.52,1.5-.52,1.11.17,1.45.51c.34.34.51.81.51,1.42,0,.65-.17,1.16-.51,1.52-.34.36-.82.54-1.45.54s-1.16-.18-1.52-.54m-1.82,15.26c0-.13.03-.2.1-.2.7,0,1.17-.16,1.42-.49.25-.33.37-.94.37-1.84v-6.04c0-.76-.08-1.32-.24-1.65-.16-.34-.42-.51-.78-.51-.29,0-.71.12-1.25.37h-.03c-.09,0-.16-.06-.2-.18-.04-.12-.03-.2.03-.22l5.09-2.36.1-.03c.11,0,.23.06.34.17.11.11.17.22.17.3v.74c-.05.9-.07,2-.07,3.31v6.1c0,.9.13,1.51.39,1.84.26.33.74.49,1.43.49.07,0,.1.07.1.2s-.03.2-.1.2c-.58,0-1.05-.01-1.38-.03l-2.02-.03-1.99.03c-.34.02-.8.03-1.38.03-.07,0-.1-.07-.1-.2"/>
        <path fill="currentColor" d="m222.52,101.44c-.02-.09-.03-.24-.03-.44v-3.24l-1.45.68c-.07.02-.29.11-.67.25-.38.15-.71.39-.99.72-.28.34-.42.73-.42,1.18,0,.54.17.96.52,1.26.35.3.75.46,1.2.46.36,0,.73-.12,1.11-.37l.74-.51Zm5.5.61c.09,0,.15.05.19.15s0,.18-.09.22l-3.47,1.65c-.09.04-.2.07-.34.07-.36,0-.7-.19-1.03-.57-.33-.38-.56-.9-.69-1.55l-1.45,1.01c-.52.38-1,.66-1.45.83-.45.17-.96.25-1.52.25-.97,0-1.7-.21-2.19-.64s-.74-1.02-.74-1.79c0-.61.15-1.1.44-1.47.29-.37.66-.66,1.1-.88.44-.21,1.05-.46,1.84-.73l.84-.3,3.03-1.11v-1.92c0-1.44-.12-2.48-.35-3.14-.24-.65-.64-.98-1.2-.98-1.19,0-1.87.92-2.02,2.77-.07.67-.26,1.16-.59,1.45-.33.29-.78.44-1.36.44s-.97-.12-1.23-.35c-.26-.24-.39-.54-.39-.93,0-.68.39-1.32,1.18-1.94.79-.62,1.74-1.12,2.85-1.5,1.11-.38,2.1-.57,2.95-.57.99,0,1.79.31,2.41.93.62.62.93,1.56.93,2.82v5.97c0,.65.12,1.16.35,1.52.24.36.57.54.99.54.32,0,.64-.08.98-.24h.03Z"/>
      </svg>
    </div>
    <div className="ml-5 w-[2px] h-8 bg-[#605045]/10 dark:bg-white/10 rounded-full overflow-hidden hidden sm:block">
      <div className="w-full h-1/3 bg-[#605045] dark:bg-[#8d7a6e] animate-digital-pulse" />
    </div>
  </div>
);

const App: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    try {
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (e) {
      console.error("Errore nel caricamento dei dati salvati:", e);
    }
    return INITIAL_FARMS;
  });

  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  // Centro e Zoom ottimizzati per la Regione Friuli Venezia Giulia
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.20, 13.15]);
  const [zoom, setZoom] = useState(9);
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);
  const [isCodeCopied, setIsCodeCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(farms));
  }, [farms]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    farms.forEach(f => categories.add(f.category));
    return Array.from(categories).sort();
  }, [farms]);

  const filteredFarms = useMemo(() => {
    if (selectedCategory === 'All') return farms;
    return farms.filter(f => f.category === selectedCategory);
  }, [selectedCategory, farms]);

  const handleSelectFarm = (farm: Farm) => {
    setSelectedFarm(farm);
    setMapCenter([farm.lat, farm.lng]);
    setZoom(14);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
          setZoom(12);
        },
        () => alert("Geolocalizzazione necessaria per trovare le aziende vicine.")
      );
    }
  };

  const handleLogoClick = () => {
    const nextClicks = logoClicks + 1;
    setLogoClicks(nextClicks);
    if (nextClicks === 3) {
      setShowAdminModal(true);
      setLogoClicks(0);
    }
    setTimeout(() => setLogoClicks(0), 2000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "TerreFVG2025") {
      setIsAdmin(true);
      setShowAdminModal(false);
      setPasswordInput("");
    } else {
      alert("Password errata.");
    }
  };

  const handleResetData = () => {
    if (window.confirm("Sei sicuro di voler ripristinare l'elenco originale? Tutti i dati caricati tramite Excel andranno persi.")) {
      setFarms(INITIAL_FARMS);
    }
  };

  const handleExportCode = () => {
    const formattedFarms = JSON.stringify(farms, null, 2);
    const tsCode = `import { Category, Farm } from '../types';\n\nexport const FARMS: Farm[] = ${formattedFarms};`;
    
    navigator.clipboard.writeText(tsCode).then(() => {
      setIsCodeCopied(true);
      setTimeout(() => setIsCodeCopied(false), 3000);
      alert("Codice DB copiato negli appunti! Incollalo qui in chat per rendere l'elenco visibile a tutti i visitatori.");
    });
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target?.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      const mappedFarms: Farm[] = data.map((row, idx) => {
        const findValue = (possibleKeys: string[]) => {
          const rowKeys = Object.keys(row);
          const matchedKey = rowKeys.find(k => 
            possibleKeys.some(pk => pk.toLowerCase().trim() === k.toLowerCase().trim())
          );
          const val = matchedKey ? row[matchedKey] : undefined;
          if (typeof val === 'string' && val.trim() === "") return undefined;
          return typeof val === 'string' ? val.trim() : val;
        };

        return {
          id: `f-${idx}-${Date.now()}`,
          name: findValue(['nome', 'azienda', 'nome azienda']) || 'Azienda Senza Nome',
          category: findValue(['categoria', 'tipo']) || Category.AziendaAgricola,
          comune: findValue(['comune', 'località']) || '-',
          lat: parseFloat(findValue(['lat', 'latitudine'])) || 46.1 + (Math.random() * 0.2 - 0.1),
          lng: parseFloat(findValue(['lng', 'longitudine'])) || 13.1 + (Math.random() * 0.2 - 0.1),
          description: findValue(['breve descrizione', 'descrizione']) || '',
          imageUrl: findValue(['header', 'immagine', 'foto principale', 'foto', 'img', 'url immagine', 'image']) || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
          logoUrl: findValue(['logo', 'brand']),
          gallery: [findValue(['foto1', 'gallery1']), findValue(['foto2', 'gallery2'])].filter(Boolean) as string[],
          products: findValue(['prodotti', 'eccellenze']) ? String(findValue(['prodotti', 'eccellenze'])).split(',').map((p: string) => p.trim()) : [],
          tags: findValue(['tag', 'caratteristiche']) ? String(findValue(['tag', 'caratteristiche'])).split(',').map((t: string) => t.trim()) : [],
          address: findValue(['indirizzo', 'via']) || '',
          phone: findValue(['telefono', 'cellulare', 'contatto']) || '',
          website: findValue(['sitoweb', 'sito', 'website', 'url']) || '',
          portalUrl: findValue(['link portale', 'portale', 'link_portale', 'portal']) || '',
          hours: findValue(['orari', 'apertura']) || '',
          isAvailable: true,
          socials: {
            fb: findValue(['facebook', 'fb']),
            ig: findValue(['instagram', 'ig']),
            email: findValue(['email', 'mail'])
          }
        };
      });

      setFarms(mappedFarms);
      setSelectedCategory('All'); 
      if (mappedFarms.length > 0) {
        setMapCenter([mappedFarms[0].lat, mappedFarms[0].lng]);
        setZoom(10);
      }
    };
    reader.readAsBinaryString(file);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`flex h-screen w-full overflow-hidden transition-colors duration-700 ${darkMode ? 'bg-[#12100e]' : 'bg-gray-50'}`}>
      
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-[2100] p-3 bg-[#605045] text-white rounded-2xl shadow-xl active:scale-90 transition-all"
      >
        {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <div className={`fixed inset-y-0 left-0 z-[2000] md:relative md:translate-x-0 transition-transform duration-500 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-0 left-0 w-full p-4 md:p-6 bg-white/95 dark:bg-[#1a1614]/95 backdrop-blur-xl z-30 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shadow-sm">
          <LogoTerreFVG onClick={handleLogoClick} />
          <div className="flex items-center gap-2">
            {isAdmin && (
              <div className="flex gap-1 animate-fade-in">
                <button 
                  onClick={handleExportCode}
                  className={`p-2.5 rounded-xl transition-all active:scale-90 flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider ${isCodeCopied ? 'bg-green-600 text-white' : 'bg-[#8d7a6e] text-white hover:bg-[#7a6a5e]'}`}
                  title="Esporta Codice per Sviluppatore"
                >
                  {isCodeCopied ? <ClipboardCheck size={18} /> : <Code size={18} />}
                  <span className="hidden lg:inline">{isCodeCopied ? 'Copiato!' : 'Esporta DB'}</span>
                </button>
                <button 
                  onClick={handleResetData}
                  className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-all active:scale-90"
                  title="Ripristina Dati Originali"
                >
                  <RotateCcw size={20} />
                </button>
                <label className="p-2.5 rounded-xl bg-[#605045] text-white hover:bg-[#4a3e35] transition-all active:scale-90 cursor-pointer" title="Carica Excel">
                  <FileUp size={20} />
                  <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} className="hidden" />
                </label>
              </div>
            )}
            <a 
              href="https://www.terrefvg.it" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-[#605045] dark:text-[#8d7a6e] hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-90"
              title="Vai al portale TerreFVG"
            >
              <Globe size={20} />
            </a>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 text-[#605045] dark:text-[#8d7a6e] hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-90" title="Cambia Tema">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <div className="pt-28 h-full overflow-hidden">
          <Sidebar 
            farms={filteredFarms}
            categories={availableCategories}
            selectedFarmId={selectedFarm?.id || null}
            onSelectFarm={handleSelectFarm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onNearMe={handleNearMe}
          />
        </div>
      </div>

      <main className="flex-1 relative h-full">
        <FarmMap 
          farms={filteredFarms}
          selectedFarmId={selectedFarm?.id || null}
          onSelectFarm={handleSelectFarm}
          mapCenter={mapCenter}
          zoom={zoom}
          darkMode={darkMode}
        />

        <button 
          onClick={() => setIsConciergeOpen(true)}
          className="absolute bottom-8 right-8 z-[1000] flex items-center gap-3 bg-[#605045] dark:bg-[#8d7a6e] text-white px-7 py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all font-bold group border border-white/10 overflow-hidden"
        >
          <Sparkles size={22} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline uppercase tracking-[0.2em] text-[11px] font-black">AI Concierge</span>
        </button>

        {selectedFarm && (
          <DetailCard farm={selectedFarm} onClose={() => setSelectedFarm(null)} />
        )}
      </main>

      {showAdminModal && (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1a1614] w-full max-w-sm p-8 rounded-3xl shadow-2xl border dark:border-white/10 animate-scale-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#605045] rounded-2xl flex items-center justify-center text-white">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold dark:text-white">Area Riservata</h3>
                <p className="text-sm text-gray-500">Accesso Gestione Dati</p>
              </div>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input 
                autoFocus
                type="password"
                placeholder="Inserisci password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-5 py-3.5 bg-gray-100 dark:bg-white/5 rounded-xl border-none focus:ring-2 focus:ring-[#605045] outline-none text-gray-700 dark:text-white font-bold"
              />
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 py-3.5 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 rounded-xl font-bold uppercase tracking-wider text-[11px]"
                >
                  Annulla
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 bg-[#605045] text-white rounded-xl font-bold uppercase tracking-wider text-[11px]"
                >
                  Sblocca
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AIConcierge isOpen={isConciergeOpen} onClose={() => setIsConciergeOpen(false)} allFarms={farms} />
    </div>
  );
};

export default App;
