// Copyright 2020 [LIPM]
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
//    limitations under the License.
import * as d3 from "d3";

export const maskMixin = {
  props: {
    seqs: {
      type: Array,
      default: () => {
        return null;
      }
    },
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 300
    }
  },
  computed: {
    xScale() {
      return d3
        .scaleLinear()
        .range([0, this.width])
        .domain([0, this.maxLength]);
    },
    yScale() {
      return d3
        .scaleLinear()
        .range([0, this.height])
        .domain([0, this.seqs.length]);
    },
    maxLength() {
      let a_lengths = this.seqs.map(seq => seq.seq.length);
      return d3.max(a_lengths);
    }
  }
};
