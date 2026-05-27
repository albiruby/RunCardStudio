const fs = require('fs');
const fix = (file, from, to) => {
    try {
        let text = fs.readFileSync('app/studio/components/' + file, 'utf8');
        text = text.replace(from, to);
        fs.writeFileSync('app/studio/components/' + file, text);
        console.log('Fixed ' + file);
    } catch (e) {
        console.log('Failed ' + file + ' ' + e);
    }
}
fix('ChallengeCardGenerator.tsx', '{formData.reward}</div>\n)}', '{formData.reward}</div>\n</div>\n)}');
fix('ChallengeCardGenerator.tsx', '</>\n               )}\n\n               {template === \\'solo mission\\'', '</div>\n               )}\n\n               {template === \\'solo mission\\'');
fix('FuelingPlanGenerator.tsx', '</>               )}', '</div>               )}');
fix('GoalCardGenerator.tsx', '</div><div className="mt-auto pt-4 flex items-end justify-between">', '<div className="mt-auto pt-4 flex items-end justify-between">');
fix('GoalCardGenerator.tsx', '&quot;{formData.motivation}&quot;\n                                  </div>\n)}\n</div>', '&quot;{formData.motivation}&quot;\n                                  </div>\n)}\n</div>\n</>\n)}');
fix('PaceBandGenerator.tsx', 'RunCard Studio\\'}\n                    </div>\n)}', 'RunCard Studio\\'}\n                    </div>\n</div>\n)}');
fix('PaceBandGenerator.tsx', '0)}%\n          </div>\n        </div>', '0)}%\n          </div>\n        </div>\n</div>\n)}');
fix('PersonalBestGenerator.tsx', '</div>\n)}\n</div>\n                    </div>\n                  )}\n                </>\n              )}', '</div>\n)}\n                    </div>\n                  )}\n                </>\n              )}');
fix('RaceBibGenerator.tsx', 'ELITE</div>\n))}\n</div>\n                   </div>', 'ELITE</div>\n))}\n                   </div>');
fix('RaceChecklistGenerator.tsx', '<div className="w-1.5 h-1.5 bg-[#0f1012] rounded-full"></div>}\n</div>\n</div>', '<div className="w-1.5 h-1.5 bg-[#0f1012] rounded-full"></div>}\n</div>');
fix('RaceRecapGenerator.tsx', 'Parseable number required </p> )} \n </div>\n             <div>', 'Parseable number required </p> )} \n             <div>');
fix('RunReceiptGenerator.tsx', '</div>\n</div>\n              )}\n           {[\\'carbon grid\\'', '</div>\n              )}\n           {[\\'carbon grid\\'');
fix('SportsCertificateGenerator.tsx', '</div>\n                       </div>\n                    </div>\n                 </div>\n </div>\n               )}', '</div>\n                       </div>\n                    </div>\n                 </div>\n               )}');
fix('TrainingWeekGenerator.tsx', '{formData.strength}</span></div>)}</div></>\n              )}', '{formData.strength}</span></div>)}</div>\n              )}');
