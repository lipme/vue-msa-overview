# vue-msa-overview

## Version

0.1.0

## Synopsis

Vue component for displaying an overview of a multiple sequence alignment.

## installation

npm install --save vue-msa-overview

## usage

~~~~
<msa-overview :seqs="seqs">

import { MsaOverview } from 'vue-msa-overview';
~~~~

seqs must be an array of this type :
~~~~
[
    {seq:"ACGT"},
    {seq:"ATGC"}
]
~~~~

## troubleshootings

Accept only nucleic acids A, C, G, T or U and "."

## contact

ludovic.cottret@inra.fr