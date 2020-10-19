# vue-msa-overview

## Synopsis

Vue component for displaying an overview of a multiple sequence alignment.

## Installation

npm install --save vue-msa-overview

## Usage

~~~~
import { MsaOverview } from 'vue-msa-overview';
~~~~

~~~~
<msa-overview :seqs="seqs">
~~~~

seqs must be an array of this type :
~~~~
[
    {seq:"ACGT"},
    {seq:"ATGC"}
]
~~~~

### Letter colors

By default, letters are colored according to the color code of Clustal for nucleotides. This is equivalent to:
~~~~
<msa-overview :seqs="seqs" :color-style="nt">
~~~~
To color according to amino acids:
~~~~
<msa-overview :seqs="seqs" :color-style="aa">
~~~~


### With a predefined selection
~~~~
<msa-overview :seqs="seqs" :selection="selection">
~~~~

selection must be an object of this type :
~~~~
{ startSeq: 3, endSeq: 5, startPos: 2, endPos: 4 }
~~~~

startSeq, endSeq : indices for the sequences
startPos, endPos : indices for the column

All indices start by 0.

An event is emitted with the indices of sequences and columns selected by hand.

### Metadata

#### Format
~~~~
<msa-overview :seqs="seqs" :metadata="metadata">
~~~~

~~~
metadata :[
  {
    label: "Metadata 1",
    categories : [
      {
        label: "cat 1",
        style: {fill: 'red'},
        regions: 
        [
          {
            id:"seq1",
            ranges: [[4,10], [14,25]]
          },
          {
            id:"seq2",
            ranges: [[3,10], [14,25]]
          }
        ]
      },
      {
        label: "cat 2",
        style: {fill: 'green'},
        regions: 
        [
          {
            id:"seq1",
            ranges: [[10,13], [26,50]]
          },
          {
            id:"seq2",
            ranges: [[11, 13]]
          }
        ]
      }
    ]
  },
]
~~~

### Display the different layers

Msa-overview has three layers or masks. Each one is displayed by default

#### Hide letter colors
~~~~
<msa-overview :seqs="seqs" :display-letters-mask="false">
~~~~

#### Hide metadata
~~~~
<msa-overview :seqs="seqs" :display-metadata-mask="false">
~~~~

#### Hide Selection
~~~~
<msa-overview :seqs="seqs" :display-selection-mask="false">
~~~~

### Display tracks

vue-msa-overview allows to display tracks above the alignment.
Be careful, the positions are 1-based and not 0-based.

~~~~
<msa-overview :seqs="seqs" :tracks="tracks">
~~~~

You have to respect this format (example):

~~~~
tracks: [
        {
          features: [
            {
              positions: [
                [1, 20],
                [109, 234]
              ],
              type: 'label1',
              color: 'green'
            },
            {
              positions: [[21, 108]],
              type: 'label2',
              color: 'pink'
            }
          ],
          trackLabel: 'track1'
        },
        {
          features: [
            {
              positions: [
                [5, 15],
                [109, 234]
              ],
              type: 'label1',
              color: 'blue'
            },
            {
              positions: [
                [50, 65],
                [16, 20]
              ],
              type: 'label2',
              color: 'red'
            }
          ],
          trackLabel: 'track2'
        }
      ]
~~~~

If you want to hide tracks: 

~~~~
<msa-overview :seqs="seqs" :tracks="tracks" :display-tracks="false">
~~~~

## Troubleshootings

Accept only nucleic acids A, C, G, T or U and "."

## Contributors
[LIPM Bioinfo Team](http://lipm-bioinfo.toulouse.inra.fr/)

 * Ludovic Cottret
 * Erika Sallet
 * Sébastien Carrère
 * Ludovic Legrand
 * Jérôme Gouzy


## Contact

ludovic.cottret@inra.fr