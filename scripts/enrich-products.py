#!/usr/bin/env python3
"""Enrich products.json with knowledge graph metadata."""
import json
import os
from datetime import datetime

BASE = os.path.join(os.path.dirname(__file__), '..', 'data', 'products.json')

# Category -> knowledge defaults
CATEGORY_DEFAULTS = {
    'smart-home-automation': {'maintenanceSchedule': 'Annual check', 'cleaningMethod': 'Dry cloth', 'installationComplexity': 'moderate', 'durabilityRating': 4, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 1, 'expectedLifespanYears': 8, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury', 'signature', 'bespoke']},
    'lighting-ambient': {'maintenanceSchedule': 'Clean quarterly', 'cleaningMethod': 'Dry cloth', 'installationComplexity': 'moderate', 'durabilityRating': 5, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 4, 'warrantyYears': 2, 'expectedLifespanYears': 10, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury', 'signature', 'bespoke']},
    'flooring': {'maintenanceSchedule': 'Clean weekly', 'cleaningMethod': 'Vacuum and mop', 'installationComplexity': 'high', 'durabilityRating': 5, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 5, 'expectedLifespanYears': 20, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury', 'signature', 'bespoke']},
    'furniture-living': {'maintenanceSchedule': 'Clean monthly', 'cleaningMethod': 'Vacuum and spot clean', 'installationComplexity': 'low', 'durabilityRating': 4, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 3, 'expectedLifespanYears': 15, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury', 'signature']},
    'furniture-bedroom': {'maintenanceSchedule': 'Clean monthly', 'cleaningMethod': 'Vacuum and spot clean', 'installationComplexity': 'low', 'durabilityRating': 4, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 3, 'expectedLifespanYears': 15, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury', 'signature']},
    'curtains-blinds': {'maintenanceSchedule': 'Clean quarterly', 'cleaningMethod': 'Vacuum or dry clean', 'installationComplexity': 'moderate', 'durabilityRating': 4, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 2, 'expectedLifespanYears': 8, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury']},
    'audio-systems': {'maintenanceSchedule': 'Check connections annually', 'cleaningMethod': 'Dry cloth', 'installationComplexity': 'moderate', 'durabilityRating': 4, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 1, 'expectedLifespanYears': 10, 'applicableBudgetTiers': ['premium', 'luxury', 'signature', 'bespoke']},
    'acoustic': {'maintenanceSchedule': 'Inspect annually', 'cleaningMethod': 'Vacuum', 'installationComplexity': 'high', 'durabilityRating': 5, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 4, 'warrantyYears': 5, 'expectedLifespanYears': 25, 'applicableBudgetTiers': ['premium', 'luxury', 'signature', 'bespoke']},
    'kitchen': {'maintenanceSchedule': 'Clean daily', 'cleaningMethod': 'Wipe with damp cloth', 'installationComplexity': 'high', 'durabilityRating': 5, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 5, 'expectedLifespanYears': 20, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury', 'signature', 'bespoke']},
    'bathroom-fittings': {'maintenanceSchedule': 'Clean weekly', 'cleaningMethod': 'Wipe with mild cleaner', 'installationComplexity': 'high', 'durabilityRating': 5, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 3, 'expectedLifespanYears': 15, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury', 'signature']},
    'smart-home': {'maintenanceSchedule': 'Update firmware quarterly', 'cleaningMethod': 'Dry cloth', 'installationComplexity': 'high', 'durabilityRating': 4, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 1, 'expectedLifespanYears': 10, 'applicableBudgetTiers': ['premium', 'luxury', 'signature', 'bespoke']},
    'lighting-architectural': {'maintenanceSchedule': 'Clean quarterly', 'cleaningMethod': 'Dry cloth', 'installationComplexity': 'high', 'durabilityRating': 5, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 4, 'warrantyYears': 3, 'expectedLifespanYears': 15, 'applicableBudgetTiers': ['premium', 'luxury', 'signature', 'bespoke']},
    'lighting-task': {'maintenanceSchedule': 'Clean quarterly', 'cleaningMethod': 'Dry cloth', 'installationComplexity': 'moderate', 'durabilityRating': 5, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 4, 'warrantyYears': 2, 'expectedLifespanYears': 10, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury']},
    'storage-organization': {'maintenanceSchedule': 'Clean monthly', 'cleaningMethod': 'Wipe down', 'installationComplexity': 'moderate', 'durabilityRating': 4, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 2, 'expectedLifespanYears': 15, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury']},
    'walls': {'maintenanceSchedule': 'Repaint every 3-5 years', 'cleaningMethod': 'Damp cloth', 'installationComplexity': 'high', 'durabilityRating': 4, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 2, 'expectedLifespanYears': 10, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury', 'signature']},
    'luxury-materials': {'maintenanceSchedule': 'Professional clean annually', 'cleaningMethod': 'Specialist cleaning', 'installationComplexity': 'high', 'durabilityRating': 5, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 5, 'expectedLifespanYears': 30, 'applicableBudgetTiers': ['luxury', 'signature', 'bespoke']},
    'bespoke-furniture': {'maintenanceSchedule': 'Professional care annually', 'cleaningMethod': 'Specialist cleaning', 'installationComplexity': 'high', 'durabilityRating': 5, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 4, 'warrantyYears': 5, 'expectedLifespanYears': 30, 'applicableBudgetTiers': ['luxury', 'signature', 'bespoke']}
}

DEFAULT = {'maintenanceSchedule': 'Clean as needed', 'cleaningMethod': 'Wipe clean', 'installationComplexity': 'moderate', 'durabilityRating': 3, 'climateSuitability': ['tropical', 'arid', 'temperate', 'continental'], 'sustainabilityScore': 3, 'warrantyYears': 1, 'expectedLifespanYears': 10, 'applicableBudgetTiers': ['comfort', 'premium', 'luxury']}

with open(BASE, 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    cat = p.get('category', '')
    defaults = CATEGORY_DEFAULTS.get(cat, DEFAULT)
    
    # only set if missing
    for key, val in defaults.items():
        if key not in p:
            p[key] = val
    
    # ensure arrays exist
    p.setdefault('relatedProducts', [])
    p.setdefault('alternativeProducts', [])
    p.setdefault('applicableSpaces', [])
    p.setdefault('applicableStyles', [])
    p.setdefault('applicableEmotions', [])
    p.setdefault('incompatibleSpaces', [])
    p.setdefault('incompatibleStyles', [])
    p.setdefault('compatibleWith', [])
    p.setdefault('incompatibleWith', [])
    p.setdefault('enhances', [])
    p.setdefault('requires', [])
    
    p.setdefault('updatedAt', datetime.utcnow().isoformat() + 'Z')

with open(BASE, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print(f'Enriched {len(products)} products with knowledge graph metadata.')
