// 'use client';

// import { FC } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import { getKeyInfo } from '../utils/dataOperations';
// import { keyInfoVariants, keyInfoItemVariants } from '../animations';
// import { useCircleOfFifthsStore } from '@/features/circle-of-fifths/store';

// /**
//  * キー情報表示コンポーネント: 削除予定。将来的に大幅改修されるため念のための残しています
//  * @deprecated
//  * ホバー中のキーに関する情報を表示します。
//  * キーの名前、調性、五度圏上の位置、平行調などの情報を表示します。
//  * アニメーション効果として、表示/非表示時のフェードとスケール変更を実装しています。
//  */
// const KeyInfoDisplay: FC = () => {
//   const selectedKey = useCircleOfFifthsStore(state => state.selectedKey);
//   if (!selectedKey) return null;

//   const keyInfo = getKeyInfo(selectedKey);

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         key={selectedKey.shortName}
//         variants={keyInfoVariants}
//         initial="hidden"
//         animate="visible"
//         exit="exit"
//         className="bg-key-area-minor border-border bottom-[4px] left-1/2 z-50 -translate-x-full translate-y-full transform rounded-lg border p-6 shadow-lg backdrop-blur-sm transition-all duration-300"
//       >
//         {/* キー名と調性 */}
//         <motion.h2
//           variants={keyInfoItemVariants}
//           className="text-text-primary mb-4 text-2xl font-bold"
//         >
//           {keyInfo.name}
//         </motion.h2>

//         {/* キーの詳細情報 */}
//         <motion.div variants={keyInfoItemVariants} className="text-text-secondary space-y-2">
//           <p>調性: {keyInfo.scale}</p>
//           {keyInfo.relativeKey && <p>平行調: {keyInfo.relativeKey}</p>}
//           <motion.div
//             variants={keyInfoItemVariants}
//             className="bg-background-muted mt-4 rounded-md p-3"
//           >
//             <p className="text-text-muted text-sm">
//               関連するコードやスケール情報は今後追加予定です
//             </p>
//           </motion.div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default KeyInfoDisplay;
